var http = require("http"),
 fs = require("fs"),
 index;

fs.readFile("./index.html", function (err, data) {
    if (err) {
        throw err;
    }
    index = data;
 });

var server = http.createServer(function(request, response) {
 response.writeHeader(200, {"Content-Type": "text/html"});
 response.write(index);
 response.end();
 }).listen(8080);

var io = require("socket.io").listen(server);
karty = require('./scripts/karty.js'); //dostep do funkcji w skrypcie karty.js (mozliwy dzieki module.exports)
karty.nowaTalia(); //tworzymy karty do gry
stol = require('./scripts/stol.js');
cyklGry = require('./scripts/cyklGry.js');
cyklGry.ustalKrok('czekanieNaGraczy'); //musimy ustalic krok na poczatek

io.sockets.on('connection', function(socket) {
    socket.emit('id', {
        id: socket.id
    });

	socket.emit('stolAktualizacja', stol.pobierzAktualnyStanStolu());    
    
    socket.on('zapytanieDodajGracza', function(data) {
        if(cyklGry.aktualnyKrok.dodajGracza(stol, data)) { //dodawanie gracza w aktualnym kroku powiodlo sie
            if(!cyklGry.porzadekTrwa) { //jesli porzadek jest zatrzymany
                cyklGry.porzadekStart(io); //to startujemy go od nowa
            }
            io.sockets.emit('stolAktualizacja', stol.pobierzAktualnyStanStolu()); //aktualizujemy stol
        }
    });    
});