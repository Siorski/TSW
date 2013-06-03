module.exports = {
    stol: {},
    zetonyPoczatkowe: 300,
    wiadomosc: "Kliknij usiądź aby zająć miejsce.",
    pozycjaClientID: [0, 0, 0, 0, 0], //ClientID jest przypisywane do miejsca przy stole
    aktywnyGracz: 0, //pozycja gracza, ktory akurat wykonuje ruch
    stawkaGracza: [0, 0, 0, 0, 0], //tablica przechowujaca obstawione stawki przez graczy
    kartyGracza : [ [], [], [], [], [] ], //karty gracza
    zetonyGracza: [0, 0, 0, 0, 0], //tablica przechowujaca zetony gracza
    opuszczoneGry: [0, 0, 0, 0, 0], // zeby nie blokowac miejsca przy stole
    miejscePrzyStole: [1, 0, 0, 0, 0], //1 jesli miejsce jest zajete
    iloscGraczy: 0, 
    wartoscRekiGracza:[0 ,0 ,0 ,0],
    wartoscRekiKrupiera: 0,

    ustawWiadomosc: function(info) {
        this.wiadomosc = info;
        console.log("Info: " + info);
    },

    pobierzPozycjeGracza: function(id) { //na podstawie ID zwraca indeks tablicy pozycjaCientID co pozwala ustalic pozycje gracza przy stole
        var pozycjaGracza = this.pozycjaClientID.indexOf(id);
        return pozycjaGracza;
    },

    dodajGracza: function(id, pozadaneMiejsce) {
        if(this.pobierzPozycjeGracza(id) >= 0) {    //jesli udalo sie pobrac pozycje gracza (czyli zajmuje on juz jakies miejsce)
            return 0; 
        } 
        if(this.miejscePrzyStole[pozadaneMiejsce] === 0 && id !== -1) //jesli pozadane miejsce przy stole jest puste oraz posiadamy id clienta
        {
            this.pozycjaClientID[pozadaneMiejsce] = id; //przypisujemy id do tablicy pozycjaClientID
            this.miejscePrzyStole[pozadaneMiejsce] = 1; //miejsce przy stole oznaczamy jako zajete
            this.zetonyGracza[pozadaneMiejsce] = this.zetonyPoczatkowe; //dajemy graczowi zetony poczatkowe
            this.iloscGraczy++; //zwiekszamy liczbe graczy
            return 1;
        } 
        else return 0;
    },

   ustalStawke: function(id, stawka) {
        var pozycjaGracza = this.pobierzPozycjeGracza(id); // funkcja pobierzPozycjeGracza zwraca pozycjeGracza przy stole
        if(pozycjaGracza && this.stawkaGracza[pozycjaGracza] === 0) //Gracz zajal miejsce ale jeszcze nie obstawił
        {
            if(stawka <= this.zetonyGracza[pozycjaGracza]) { // jesli gracza "stac" na zaklad
                return this.obstaw(id, stawka);              //to obstawia wybrana stawke
            }
        }
        return 0;
    },

    obstaw: function(id, stawka) {      
        var pozycjaGracza = this.pobierzPozycjeGracza(id);
        if(stawka > 0) {    //jesli stawka jest wieksza od 0
            this.opuszczoneGry[pozycjaGracza] = 0;       //zerujemy opuszczoneGry danego gracza 
            this.stawkaGracza[pozycjaGracza] = this.stawkaGracza[pozycjaGracza] + stawka;     //dodajemy obstawione zetony do stawki
            this.zetonyGracza[pozycjaGracza] = this.zetonyGracza[pozycjaGracza] - stawka;     //odejmujemy obstawione zetony z budzetu gracza
            return 1;
        }
    },    

    wszystkieRozdaneKarty: function() {
        var rozdaneKarty = [ [], [], [], [], [] ];
        for(var gracz = 0; gracz < stol.kartyGracza.length; gracz++) { //przechodzimy przez graczy
            var rekaTemp = stol.kartyGracza[gracz].slice();    //dla kazdego gracza zapisujemy jego karty w pomocniczej tabeli
            for(var i = 0; i < rekaTemp.length; i++) {  //przechodzimy przez te karty
                var kartyTemp = stol.kartyGracza[gracz][i].slice();   //zapisujemy kazda karte bedaca w posiadaniu tego gracza do pomocniczej tabeli
                rozdaneKarty[gracz][i] = kartyTemp.slice();           //przepisujemy je pojedynczo do ostatecznej tabeli
            }
        }
        this.stol.kartyGracza = rozdaneKarty;     
    },

    pobierzAktualnyStanStolu: function() { //pobieramy wszystkie dane ze stolu
        this.stol.zetonyPoczatkowe = stol.zetonyPoczatkowe;
        this.stol.wiadomosc = stol.wiadomosc;
        this.stol.pozycjaClientID = stol.pozycjaClientID;
        this.stol.aktywnyGracz = stol.aktywnyGracz;
        this.stol.stawkaGracza = stol.stawkaGracza;
        this.stol.zetonyGracza = stol.zetonyGracza;
        this.stol.opuszczoneGry = stol.opuszczoneGry;
        this.stol.miejscePrzyStole = stol.miejscePrzyStole;
        this.stol.iloscGraczy = stol.iloscGraczy;
        this.stol.wartoscRekiGracza = stol.wartoscRekiGracza;
        this.stol.wartoscRekiKrupiera = cyklGry.wartoscRekiKrupiera;
        this.wszystkieRozdaneKarty();
        return this.stol;
    },

    usunGracza: function(id) {
        var pozycjaGracza = this.pobierzPozycjeGracza(id);
        this.pozycjaClientID[pozycjaGracza] = 0; //usuwamy clientID 
        this.miejscePrzyStole[pozycjaGracza] = 0; //zwalniamy miejsce przy stole
        this.opuszczoneGry[pozycjaGracza] = 0; //zerujemy opuszczoneGry
        this.stawkaGracza[pozycjaGracza] = 0;  //zerujemy stawkeGracza
        this.iloscGraczy--; //zmniejszamy ilosc graczy
    },

    usunWszystkichGraczy: function() {
        for(var pozycjaGracza = 1; pozycjaGracza < 5; pozycjaGracza += 1) //przechodzimy przez wszystkie pozycje
        {
            if(this.pozycjaClientID[pozycjaGracza] !== 0){  //jesli jakas pozycja jest zajeta
                this.usunGracza(this.pozycjaClientID[pozycjaGracza]); //usuwamy gracza
            }
        }
        this.iloscGraczy = 0;  // zerujemy inne wartosci
        this.opuszczoneGry = [0, 0, 0, 0, 0];
        this.pozycjaClientID = [0, 0, 0, 0, 0];
        this.miejscePrzyStole = [1, 0, 0, 0, 0]; //zwalniamy wszystkie miejsca oprocz miejsca krupiera
    },

    usunNiekatywnychGraczy: function() {
        for(var pozycjaGracza = 1; pozycjaGracza < 5; pozycjaGracza++) { 
            if(this.opuszczoneGry[pozycjaGracza] >= 2) {    //jesli gracz opuscil 2 rozdania pod rzad
                this.usunGracza(this.pozycjaClientID[pozycjaGracza]); //usuwamy gracza
            }
        }
    },

    resetStolu: function() { //reset stolu wykonywany w rundzie podsumowujacej rozdanie
        this.usunNiekatywnychGraczy(); //usuwamy graczy nieaktywnych
        this.stawkaGracza = [0, 0, 0, 0, 0]; //resetujemy stawki graczy
        this.kartyGracza = [ [  ], [  ], [  ], [  ], [  ] ]; //ich karty
        this.wartoscRekiGracza = [0, 0, 0, 0]; //oraz wartosci kart graczy
    },

    graczePozaGra: function() { //zwracamy liczbe graczy nie bioracych udzial w rozdaniu
        var licznikGraczyPozaGra = 0;
        for(var pozycjaGracza = 1; pozycjaGracza < 5; pozycjaGracza++) {
            if(this.miejscePrzyStole[pozycjaGracza] === 1) { //jesli miejsce przy stole jest zajete
                if(this.stawkaGracza[pozycjaGracza] === 0) { //a gracz nic nie postawil
                    licznikGraczyPozaGra++;                 //znaczy to ze jest poza gra
                } 
                else {
                    this.opuszczoneGry[pozycjaGracza] = 0;  //jesli postawil to zerujemy jego opuszczoneGry
                }
            }
        }
        return licznikGraczyPozaGra; 
    }
};