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

io.sockets.on('connection', function(socket) {
    socket.emit('id', {
        id: socket.id
    });
});