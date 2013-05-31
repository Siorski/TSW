module.exports = { //sprawia ze funkcje sa widoczne poza tym plikiem, dekalarcja funkcji wyglada wtedy tak - abc: function(){}
    figury: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "D", "K"],
    kolory: ["Ser", "Kar", "Krz", "Pik"],
    talia: [],
    potasowanaTalia: [],
    iloscTalii: 4, //ilosc talii bioracych udzial w grze

    tworzenieTalii: function() { //funkcja tworzaca talie kart do gry
        for(var k=0; k < this.iloscTalii; k++) { //dla kazdej talii przechodzimy
            for(var i=0; i < 4; i++) {           //przez wszystkie kolory 
                for(var j=0; j < 13; j++) {      // i przez wszystkie figury generujac unikalna karte (kolor i figura)
                    this.talia.push(this.figury[j] + "" +  this.kolory[i]); //wpisujemy je do tabeli Talia 
                }
            }
        }
    },

    tasowanieTalii: function() {  //funkcja tasujaca karty 
        var tempTalia = this.talia.slice(0); //slice(0) zwraca wszystkie elementy tablicy, czyli przepisujemy talie do tempTalia
        for(var i = 0; i < this.talia.length; i++) { //dla kazdej karty w talii wykonujemy tasowanie, math.floor zwraca największą liczbę całkowitą mniejszą lub równą podanej liczbie
            rand = Math.floor(Math.random() * tempTalia.length); //math.random zwraca liczbe pomiedzy 0 a 1, mnozymy to razy dlugosc talii tymczasowej(ilosc kart pozostalych w talii),
            this.potasowanaTalia.push(tempTalia.splice(rand, 1)); //rand - indeks w tablicy o ktorego rozpoczynamy usuwanie, 1 to ilosc elementow usuwanych
        }                                                         //push wpisuje usuniety element z tempTalia do potasowanejTalii
    },

    pustaTalia: function() {    //zerujemy wszystkie talie
        this.talia = [];
        this.potasowanaTalia = [];
        return 1;
    },

    nowaTalia: function() { 
        this.pustaTalia();  //tworzymy nowa pusta talie
        this.tworzenieTalii();  //wypelniamy ja kartami
        this.tasowanieTalii(); //tasujemy talie
    },

    wymaganeTasowanie: function() { //zwraca true jesli ilosc kart w potasowanejTalii jest mniejsza niz 1/3 wszystkich kart
        if(this.potasowanaTalia.length < (52 * this.iloscTalii * 0.33)){
            console.log("Wymagane tasowanie kart.")
        }
        else {
            return 0;
        }
    }
};