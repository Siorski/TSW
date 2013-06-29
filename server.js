var http = require("http");
var express = require('express');
var app = express();
var path = require('path');

app.configure(function () {
    app.set('port', process.env.PORT || 8080);
    app.use(express.static(path.join(__dirname, 'public')));
});


app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

var server = http.createServer(app).listen(app.get('port'));

var io = require("socket.io").listen(server);
io.set('log level', 1); //logi w konsoli
karty = require('./public/scripts/karty.js'); //dostep do funkcji w skrypcie karty.js (mozliwy dzieki module.exports)
karty.nowaTalia(); //tworzymy karty do gry
stol = require('./public/scripts/stol.js');
cyklGry = require('./public/scripts/cyklGry.js');
cyklGry.ustalKrok('czekanieNaGraczy'); //musimy ustalic krok na poczatek

io.sockets.on('connection', function(socket) {

    stol.iloscGraczy++; //kazde nowe polaczenie zwieksza liczbe graczy

    socket.emit('id', {
        id: socket.id
    });

	socket.emit('stolAktualizacja', stol.pobierzAktualnyStanStolu());   //serwer wyswietla aktualny stan stolu
    
    socket.on("disconnect", function(){
        stol.usunGracza(socket.id); //usuwamy gracza ze stolu
        io.sockets.emit('stolAktualizacja', stol.pobierzAktualnyStanStolu()); //aktualizujemy stol
    });

    socket.on('zapytanieDodajGracza', function(data) {
        if(cyklGry.aktualnyKrok.dodajGracza(stol, data)) { //dodawanie gracza w aktualnym kroku powiodlo sie
            if(!cyklGry.porzadekTrwa) { //jesli porzadek jest zatrzymany
                cyklGry.porzadekStart(io); //to startujemy go od nowa
            }
            io.sockets.emit('stolAktualizacja', stol.pobierzAktualnyStanStolu()); //aktualizujemy stol
        }
    });

    socket.on('zapytanieObstaw', function(data) {
        if(cyklGry.aktualnyKrok.ustalStawke(data)) { // jesli udalo sie ustalic stawke w aktualnym kroku
            if(!cyklGry.porzadekTrwa) { //jesli porzadek jest zatrzymany to
                cyklGry.porzadekStart(io); //startujemy go od nowa
            } 
            io.sockets.emit('stolAktualizacja', stol.pobierzAktualnyStanStolu()); //aktualizujemy stol
        }
    });  

    socket.on('zapytanieHit', function(data) {
        if(cyklGry.aktualnyKrok.hit(data)) { //dobieramy karte w aktualnym kroku
            io.sockets.emit('stolAktualizacja', stol.pobierzAktualnyStanStolu()); //aktualizujemy stol
        }
    });

    socket.on('zapytaniePas', function(data) {
        if(cyklGry.aktualnyKrok.pas(data)) { //pasujemy w aktualnym kroku
            io.sockets.emit('stolAktualizacja', stol.pobierzAktualnyStanStolu()); //aktualizujemy stol
        }
    });

    socket.on('zapytanieDoubleDown', function(data) {
        if(cyklGry.aktualnyKrok.doubleDown(data)) { //podwajamy stawke w aktualnym kroku
            io.sockets.emit('stolAktualizacja', stol.pobierzAktualnyStanStolu()); //aktualizujemy stol
        }
    });
  
});