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

    pobierzCzasCzekania: function() { //pobieramy
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
            }, cyklGry.pobierzCzasCzekania() );  //metoda setTimeout wykona funkcje (podana jako pierwszy parametr) czekajac okreslona ilosc czasu (podana jako drugi parametr)
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
        czekanieNaGraczy: {  //pierwszy krok
            poczatekKroku: function() {},
            koniecKroku: function() {},
            ustalStawke: function() {},
            dodajGracza: function(stol, data) {
                return stol.dodajGracza(data["clientID"], data["pozadaneMiejsce"]);
            },
            hit: function() {},
            pas: function() {},
            doubleDown: function() {},
            wiadomosc: "Proszę zajmować miejsca przy stole.",
            czasCzekania: 5000  // ten krok trwa 5 sekund
        },

        przyjmowanieStawek: { //drugi krok
            obstawianieStawekZegar: 0,
            usunGraczyPoCzasie: function() {
                stol.usunWszystkichGraczy(); //po uplywie 30 sekund wszystkich usuwamy ze stolu i 
                stol.resetStolu(); //resetujemy wszystkie wlasciwosci stolu
                cyklGry.porzadekReset(); // oraz porzadek
                cyklGry.io.sockets.emit('stolAktualizacja', stol.pobierzAktualnyStanStolu()); //odswiezamy stol
                console.log("Przekroczono czas na przyjmowanie stawek. Usunięto wszystkich graczy.")
            },
            poczatekKroku: function() {},
            koniecKroku: function() {
                if(stol.graczePozaGra() && (stol.graczePozaGra() === stol.iloscGraczy)) { //jesli wszyscy gracze nie biora udzialu w rozdaniu
                    cyklGry.porzadekPauza(); //zatrzymujemy porzadek
                    cyklGry.aktualnyKrok.obstawianieStawekZegar = setTimeout(this.usunGraczyPoCzasie, 30000); // po 30 sekundach usuwani sa wszyscy gracze
                }
            },
            ustalStawke: function(data) {
                if(stol.ustalStawke(data["clientID"], data["stawka"])) {
                    clearTimeout(cyklGry.aktualnyKrok.obstawianieStawekZegar); //jesli udalo sie ustalic stawke to zerujemy zegar
                    return 1;
                }
            },
            dodajGracza: function(stol, data) { //mozna dochodzic takze w trakcie obstawiania
                return stol.dodajGracza(data["clientID"], data["pozadaneMiejsce"]);
            }, 
            hit: function() {}, //podobnie jak wszystkie akcje z kartami
            pas: function() {},
            doubleDown: function() {},
            wiadomosc: "Postaw swoją stawkę.",
            czasCzekania: 10000 //ten krok trwa 10 sekund
        },

        ruchGracza: { //trzeci krok
            ruchGraczaZegar: 0,
            przekroczonyCzasRuchuGracza: function() { //jesli gracz przekroczyl czas na ruch
                if(stol.nastepnyGracz()) { //przechodzimy do nastepnego gracza
                    console.log("Przekroczony czas na ruch gracza.");
                    cyklGry.aktualnyKrok.ruchGraczaZegar = setTimeout(cyklGry.aktualnyKrok.przekroczonyCzasRuchuGracza, 10000);  //ustawiamy nowy czas dla nastepnego gracza
                } 
                else { //jesli juz nie ma nastepnego gracza wznawiamy porzadek
                    cyklGry.porzadekWznow();
                }
                cyklGry.io.sockets.emit('stolAktualizacja', stol.pobierzAktualnyStanStolu());
            },
            poczatekKroku: function() {
                stol.blokowanieMiejsca(); //sprawdzamy czy nikt nie blokuje miejsca (siedzi a nie obstawil)
                stol.rozdaj(karty);     //rozdajemy karty
                cyklGry.porzadekPauza(); //wstrzymujemy porzadek
                stol.ustalPierwszegoGracza(); //ustalamy ktory gracz wykonuje pierwszy ruch.
                cyklGry.aktualnyKrok.ruchGraczaZegar = setTimeout(cyklGry.aktualnyKrok.przekroczonyCzasRuchuGracza, 10000); //gracz ma 10 sek na ruch
            },
            koniecKroku: function() {},
            ustalStawke: function() {}, //w tym kroku nie da sie obstawiac
            dodajGracza: function() {}, //ani dodawac graczy
            hit: function(data) {
                var hitSukces = stol.hit(data["clientID"]);  //wykonujemy 'hit'
                if(hitSukces) { //jesli udalo sie dobrac karte
                    if(stol.wartoscRekiGracza[stol.aktywnyGracz-1] >= 21) { //jesli po dobraniu karty wartosc reki jest wieksza lub rowna 21
                        if(stol.nastepnyGracz()) { //przechodzimy do nastepnego gracza
                            clearTimeout(cyklGry.aktualnyKrok.ruchGraczaZegar); //zerujemy czas na ruch gracza
                            cyklGry.aktualnyKrok.ruchGraczaZegar = setTimeout(cyklGry.aktualnyKrok.przekroczonyCzasRuchuGracza, 10000); //gracz ma 10 sek na ruch
                        } 
                        else { //jesli nie ma nastepnego gracza
                            clearTimeout(cyklGry.aktualnyKrok.ruchGraczaZegar); //zerujemy czas na ruch gracza
                            cyklGry.porzadekWznow(); //wznawiamy porzadek
                        }
                    } 
                    else { //jesli wartosc reki nadal jest mniejsza od 21
                        clearTimeout(cyklGry.aktualnyKrok.ruchGraczaZegar); 
                        cyklGry.aktualnyKrok.ruchGraczaZegar = setTimeout(cyklGry.aktualnyKrok.przekroczonyCzasRuchuGracza, 10000); // ten sam gracz wykonuje kolejny ruch, znow ma 10 sek
                    }
                }
                return hitSukces;
            },
            pas: function(data) {
                var pasSukces = stol.pas(data["clientID"]); 
                if(pasSukces) { //jesli pas sie udal
                    if(stol.nastepnyGracz()) { //pzechodzimy do nastepnego gracza
                        clearTimeout(cyklGry.aktualnyKrok.ruchGraczaZegar); //zerujemy czas na ruch gracza
                        cyklGry.aktualnyKrok.ruchGraczaZegar = setTimeout(cyklGry.aktualnyKrok.przekroczonyCzasRuchuGracza, 10000); //gracz ma 10 sek na ruch
                    } 
                    else { //jesli nie ma nastepnego gracza
                        clearTimeout(cyklGry.aktualnyKrok.ruchGraczaZegar); //zerujemy czas na ruch gracza
                        cyklGry.porzadekWznow(); //wznawiamy porzadek
                    }
                }
                return pasSukces;
            },
            doubleDown: function(data) {
                var doubleDownSukces = stol.doubleDown(data["clientID"]); //wykonujemy 'doubleDown'
                if(doubleDownSukces) { //jesli doubleDown sie udal
                    if(stol.nastepnyGracz()) { //przechodzimy do nastepnego gracza
                        clearTimeout(cyklGry.aktualnyKrok.ruchGraczaZegar); //zerujemy czas na ruch gracza
                        cyklGry.aktualnyKrok.ruchGraczaZegar = setTimeout(cyklGry.aktualnyKrok.przekroczonyCzasRuchuGracza, 10000); //gracz ma 10 sek na ruch
                    } 
                    else { //jesli nie ma nastepnego gracza
                        clearTimeout(cyklGry.aktualnyKrok.ruchGraczaZegar); //zerujemy czas na ruch gracza
                        cyklGry.porzadekWznow(); //wznawiamy porzadek
                    }
                }
                return doubleDownSukces;
            },
            ukryjKartyKrupiera: 1, //zakrywamy 1 karte krupiera
            wiadomosc: "Czekanie na ruch graczy.",
            czasCzekania: 3000
        },

        ruchKrupiera: { //czwarty krok
            akcjaKrupiera: function() {
                if(stol.wartoscReki(stol.kartyGracza[0] === 21)) { //jesli krupier ma BlackJacka
                    cyklGry.wartoscRekiKrupiera = 21; //ustawiamy wartosc do wyswietlenia na 21
                    console.log("Krupier ma blackjacka");
                    this.porzadekIndex = 4; //przechodzimy do podsumowania
                }
                if(stol.wartoscReki(stol.kartyGracza[0]) < 17) { //jesli krupiera ma mniej niż 17
                    stol.kartyGracza[0].push(karty.potasowanaTalia.pop()); //dobiera karte
                    cyklGry.wartoscRekiKrupiera = stol.wartoscReki(stol.kartyGracza[0]); // potrzebne do wyswietlenia
                    cyklGry.io.sockets.emit('stolAktualizacja', stol.pobierzAktualnyStanStolu()); //odswiezamy stol
                    setTimeout(cyklGry.aktualnyKrok.akcjaKrupiera, 2000); //czekamy 2 sekundy i powtarzamy krok
                } 
                else { //jesli krupier ma wiecej niz 16 to nie dobiera juz kart
                    cyklGry.wartoscRekiKrupiera = stol.wartoscReki(stol.kartyGracza[0]); //potrzebne do wyswietlenia
                    cyklGry.porzadekWznow(); //wznawiamy porzadek
                }
            },
            poczatekKroku: function() {
                stol.aktywnyGracz = 0;
                cyklGry.wartoscRekiKrupiera = stol.wartoscReki(stol.kartyGracza[0]);
                if(stol.sprawdzCzyKtosGra()) { //jesli sa gracze nadal pozostajacy w grze
                    cyklGry.porzadekPauza(); //wstrzymujemy porzadek
                    cyklGry.io.sockets.emit('stolAktualizacja', stol.pobierzAktualnyStanStolu()); //odswiezamy stol
                    setTimeout(cyklGry.aktualnyKrok.akcjaKrupiera, 2000); //wywolanie akcji krupiera po 2 sekundach
                }
            },
            koniecKroku: function() {
                if(karty.wymaganeTasowanie()) { //jesli karty wymagaja tasowania
                    karty.nowaTalia(); //tasujemy
                    console.log("Krupier tasuje karty.");
                }
            },
            ustalStawke: function() {}, //w tym kroku zadna opcja nie jest mozliwa
            dodajGracza: function() {},
            hit: function(data) {},
            pas: function() {},
            doubleDown: function() {},
            ukryjKartyKrupiera: 0, //pokazujemy karty krupiera
            wiadomosc: "Ruch krupiera.",
            czasCzekania: 3000
        },

        podsumowanie: { //ostatni, piaty krok
            poczatekKroku: function() {},
            koniecKroku: function() {
                stol.wyplata(); //wyznaczanie zwyciezcow oraz wyplata wygranych
                stol.resetStolu(); //resetujemy stol 
            },
            ustalStawke: function() {}, //w tym kroku zadna opcja nie jest mozliwa
            dodajGracza: function() {},
            hit: function() {},
            pas: function() {},
            doubleDown: function() {},
            ukryjKartyKrupiera: 0,
            wiadomosc: "Wypłacanie wygranych dla zwycięzców.",
            czasCzekania: 3000
        } 
    }
};

        