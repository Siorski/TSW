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
    }
};