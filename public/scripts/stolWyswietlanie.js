/*jshint node: true */
/*jshint sub: true */
/*global $:false, stolGlobal:false */
/*exported wyswietlStol*/

'use strict';
function wyswietlStol() {
    wyswietlanieKart();
    wyswietlanieInformacji();    
    wyswietlanieZetonow();
    wyswietlanieGuzikow();
    wyswietlanieStawek();
    wyswietlanieWartosciKartGracza();
    wyswietlanieWartosciKartKrupiera();
}

function wyswietlanieKart() {
    $(".karta").remove(); //najpierw usuwamy stary div z kartami
    $("[id^='miejsce']").each(function(index) { //przechodzimy przez wszystkie divy ktorych id zaczyna sie od 'miejsce' 
        if(stolGlobal.miejscePrzyStole[index] === 1) {  //jesli jakies miejsce jest zajete
            kartyNaStol($(this), index);   //wyswietlamy karty
        }
    });
}

function kartyNaStol(divCss, pozycjaGracza) {
    for(var karta = 0; karta < stolGlobal.kartyGracza[pozycjaGracza].length; karta++) { //dlugosc tablicy kartGracza wyznacza nam liczbe kart do wyswietlenia
        divCss.append("<div class='karta' data-karta='" + stolGlobal.kartyGracza[pozycjaGracza][karta] + "'" + "style='bottom: " + (8 * karta) + "px; left: " + (16 * karta) + "px '> </div>");
    } //wstawiamy div karta przesuwajaca kazda kolejna karte aby nie nachodzily na siebie
    $(".karta").each(function() {   //przechodzimy teraz przez wszystkie divy karta
        var nazwaKarty = String($(this).data('karta')); //pobieranie nazwy karty, (div karta ma atrybut data gdzie jest zapisana nazwa 4 znakowa, 1 znak oznacza figure, pozostale 3 kolor)
        $(this).css("background-image", 'url(obrazki/karty/' + nazwaKarty + '.png)');
    });
}

function wyswietlanieInformacji() {
    $("#informacje").text(stolGlobal.wiadomosc); //w divie "informacje" wyswietlamy aktualna wiadomosc
}

function wyswietlanieZetonow() { 
    $(".zetonyGracza").each(function(index) { //przechodzimy przez wszystkie divy zetonyGracza
        if(stolGlobal.miejscePrzyStole[index + 1] === 0) { //jesli miejsce przy stole jest wolne (index +1 poniewaz miejsce o indeksie 0 jest zajete przez krupiera) 
            $(this).hide(); //nie pokazujemy nic
        } 
        else {
            $(this).show(); //jesli miejsce jest zajete
            $(this).text('Zetony ' + stolGlobal.zetonyGracza[index + 1]); //pokazujemy ilosc zetonow
        }
    });
}

function wyswietlanieGuzikow() {
    $(".usiadzButton").each(function(index) { //przechodzimy przez wszystkie przyciski usiadz
        if(stolGlobal.miejscePrzyStole[index + 1] === 1) {  //jesli miejsce przy stole jest zajete
            $(this).hide(); //ukrywamy przycisk
        } else {
            $(this).show(); //jesli jest wolne pokazujemy przycisk
        }
    });

    $(".pozaGraButton").hide().each(function(index) { //przechodzimy przez wszystkie przyciski pozaGra
        if(stolGlobal.miejscePrzyStole[index + 1] === 1 && stolGlobal.opuszczoneGry[index + 1] > 0) { //jesli miejsce jest zajete a gracz opuscilGre 
            $(this).show(); //pokazujemy przycisk
        }
    });
}

function wyswietlanieWartosciKartGracza(){
    $(".wartoscRekiGracza").each(function(index) { //przechodzimy przez wszystkie divy "wartoscRekiGracza"
        if( stolGlobal.miejscePrzyStole[index+1] === 0  || stolGlobal.wartoscRekiGracza[index] === 0)  { //jesli miejsce przy stole jest wolne lub wartoscRekiGracza jest 0
            $(this).hide(); //nie pokazujemy nic
        } 
        else {
            $(this).show(); //jesli miejsce jest zajete
            $(this).text( "Wartosc kart: " + stolGlobal.wartoscRekiGracza[index]); //pokazujemy wartosc kart gracza
        }
    });
}

function wyswietlanieStawek() {
    $(".stawkaGracza").each(function(index) { //przechodzimy przez wszystkie divy stawkiGraczy
        if(stolGlobal.stawkaGracza[index + 1] === 0) { //jesli stawka jest rowna 0
            $(this).hide(); // nie pokazujemy jej
        } 
        else {
            $(this).show(); //w przeciwnym wypadku wyswietlamy stawke
            $(this).text(stolGlobal.stawkaGracza[index + 1]);
        }
    });
}

function wyswietlanieWartosciKartKrupiera(){
    if(stolGlobal.wartoscRekiKrupiera === 0){ //jesli wartoscRekiKrupiera jest rowna 0 to
        $(".wartoscRekiKrupiera").hide(); //nie wyswietlamy nic
    }
    else {  //w przeciwnym wypadku
        $(".wartoscRekiKrupiera").show(); //wyswietlamy wartosc
        $(".wartoscRekiKrupiera").text("Wartosc kart: " + stolGlobal.wartoscRekiKrupiera);
    }
}