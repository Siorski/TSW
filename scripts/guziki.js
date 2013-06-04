/*jshint node: true */
/*jshint sub: true */
/*global $:false, socket:false, IDClientGlobal: false, stolGlobal: false */
'use strict';

$(".usiadzButton").click(function() {
    var data = {};
    data["pozadaneMiejsce"] = $(".usiadzButton").index(this) + 1;	//pozadane miejsce to +1 od indeksu kliknietego guzika
    data["clientID"] = IDClientGlobal;		//przypisujemy clientID do globalnej zmiennej
    socket.emit('zapytanieDodajGracza', data);	
});

$("#stawkaMinus").click(function(){
    var temp = $('#obstawButton').data('stawkaogolna'); //pobieramy stawke z index.html (do buttonu jest przypisana stawka)
    if( temp > 0) {	//jesli stawka jest wieksza od 0
    temp = temp - 5; //klikniecie buttonu zmniejszy stawke o 5
    }
    $('#obstawButton').text("Stawka " + temp);
    $('#obstawButton').data('stawkaogolna', temp);
});

$("#obstawButton").click(function() {
    var data = {};
    data["stawka"] = $('#obstawButton').data('stawkaogolna');
    data["clientID"] = IDClientGlobal;
    socket.emit('zapytanieObstaw', data);
});

$("#stawkaPlus").click(function() {
        var temp = $('#obstawButton').data('stawkaogolna');
        for(var x=0; x <5; x++) { //przechodzimy przez pozycje 
            if(stolGlobal.pozycjaClientID[x] === IDClientGlobal) { //jesli w tablicy z ClientID jest pozycja z id naszego clienta 
                if (temp < stolGlobal.zetonyGracza[x]) {	//to na podstawie jego indeksu okreslimy ilosc jego zetonow (jesli jest ich mniej niz aktualna stawka)
                temp = temp + 5;    //klikniecie buttonu zwiekszy stawke o 5
                }
            }
        }
        $('#obstawButton').text("Stawka " + temp);
        $('#obstawButton').data('stawkaogolna', temp);
});

$("#hit").click(function() {
    var data = {};
    data["clientID"] = IDClientGlobal;
    socket.emit('zapytanieHit', data);
});

$("#pas").click(function() {
    var data = {};
    data["clientID"] = IDClientGlobal;
    socket.emit('zapytaniePas', data);
});

$("#doubledown").click(function() {
    var data = {};
    data["clientID"] = IDClientGlobal;
    socket.emit('zapytanieDoubleDown', data);
});