module.exports = {
    porzadekTrwa: 0, 
    porzadek: ["czekanieNaGraczy", "przyjmowanieStawek", "ruchGracza", "ruchKrupiera", "podsumowanie"], //kolejne kroki porzadku gry
    porzadekIndex: 0, //indeks kroku w porzadku
    wartoscRekiKrupiera: 0,
    
    porzadekStart: function(ioDane) {
        this.io = ioDane;
        this.porzadekTrwa = 1;  //porzadek jest w trakcie
        cyklGry.ustalKrok(this.porzadek[this.porzadekIndex]); //ustalamy krok w porzadku
        this.krok();
    },

    porzadekPauza: function() {
        this.porzadekTrwa = 0;
    },
    
    porzadekWznow: function() {
        this.porzadekTrwa = 1; //ustawiamy na true
        this.przejdzDoNastepnegoKroku();
        this.io.sockets.emit('stolAktualizacja', stol.pobierzAktualnyStanStolu()); //aktualizujemy stol
    },
    
    porzadekReset: function() { 
        this.porzadekIndex = 0; //ustawiamy index kroku w porzadku na 0
        cyklGry.ustalKrok(this.porzadek[this.porzadekIndex]);  //ustalamy krok od tego indeksu
        stol.ustawWiadomosc(cyklGry.pobierzWiadomosc()); //ustawiamy odpowiednia wiadomosc
        cyklGry.pobierzKrok().poczatekKroku(); // idziemy na poczatek aktualnego kroku
    },
    
    ustalKrok: function(krok) {
        this.aktualnyKrok = this.kroki[krok];
    },

    pobierzKrok: function() { 
        return this.aktualnyKrok;
    },

    ustalCzasCzekania: function() {
        return this.aktualnyKrok.czasCzekania;
    },

    pobierzWiadomosc: function() {  //pobieramy wiadomosc. ktora ma zostac wyswietlona
        return this.aktualnyKrok.wiadomosc;
    },

    krok: function() { //funkcja przechodzaca przez krok w porzadku
        stol.ustawWiadomosc(cyklGry.pobierzWiadomosc()); //ustalamy wiadomosc do wyswietlenia
        cyklGry.pobierzKrok().poczatekKroku(); //idziemy na poczatek aktualnego kroku
        if(this.porzadekTrwa){ // jesli porzadek trwa
            setTimeout(function() {
                cyklGry.przejdzDoNastepnegoKroku();
            }, cyklGry.ustalCzasCzekania() );  //metoda setTimeout wykona funkcje (podana jako pierwszy parametr) czekajac okreslona ilosc czasu (podana jako drugi parametr)
        }
        this.io.sockets.emit('stolAktualizacja', stol.pobierzAktualnyStanStolu()); //odswiezamy stol
    },
    
    przejdzDoNastepnegoKroku: function() { //wykonuje sie po przekroczeniu czasu w aktualnym kroku
        cyklGry.pobierzKrok().koniecKroku(); //przechodzimy na koniec aktualnego kroku
        if(this.porzadekTrwa) { //jesli porzadek trwa
            this.porzadekIndex++; //przechodzimy do nastepnego kroku w porzadku
            if(this.porzadekIndex === this.porzadek.length) { //jesli ten krok to ostatni krok (czyli rozdanie sie skonczylo)
                this.porzadekIndex = 0; //wracamy na poczatek porzadku
            }
            cyklGry.ustalKrok(this.porzadek[this.porzadekIndex]); //jesli krok nie jest ostatnim to ustalamy krok na kolejny w porzadku
            this.krok();   
        }
    },

    aktualnyKrok: {},
    kroki: { //tablica z krokami w porzadku
        czekanieNaGraczy: { 
            poczatekKroku: function() {},
            koniecKroku: function() {},
            ustalStawke: function() {},
            dodajGracza: function(stol, requestData) {
                return stol.dodajGracza(requestData["clientID"], requestData["pozadaneMiejsce"]);
            },
            hit: function() {},
            pas: function() {},
            doubleDown: function() {},
            wiadomosc: "Proszę zajmować miejsca przy stole.",
            czasCzekania: 5000         
        }
    }
};

        