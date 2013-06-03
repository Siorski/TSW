function wyswietlStol() {
    wyswietlanieGuzikow();
    wyswietlanieZetonow();
    wyswietlanieInformacji();
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

