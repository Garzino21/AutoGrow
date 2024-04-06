"use strict"
$(document).ready(function () {

    //variabili
    let _apri = $("#apri");
    let _paginaIniziale = $("#paginaIniziale");
    let _paginaDati = $("#paginaDati");
    let _progetto = $("#progetto");
    let _info = $("#info");
    let _body = $("body");
    let _indietro = $("#indietro");
    let _rilevamenti = $("#rilevamenti");
    let _modalitaIrrigazione = $("#btnModalita");
    let _tabAutomatico = $("#tabAutomatico");
    let _btnAccendi = $("#btnAccendi");
    let _btnSpegni = $("#btnSpegni");   


    //impostazioni di avvio
    _paginaIniziale.show().css("margin-top", "flex");
    _paginaDati.hide();
    _progetto.hide();
    _indietro.hide();

    _btnAccendi.hide();
    _btnSpegni.hide();

    //gestione eventi
    _apri.on("click", function () {
        _paginaIniziale.hide();
        _paginaDati.show();
        _info.hide();
        _apri.hide();
        _indietro.show();
        _body.css("overflow", "scroll");
    });

    _info.on("click", function () {
        _progetto.show();
        _paginaIniziale.hide();
        _indietro.show();
        _body.css("overflow", "scroll");
    })

    _indietro.on("click", function () {
        _paginaIniziale.show();
        _paginaDati.hide();
        _progetto.hide();
        _info.show();
        _apri.show();
        _indietro.hide();
        _body.css("overflow", "hidden");
    })

    _modalitaIrrigazione.on("click", function () {
        if (_modalitaIrrigazione.text() == "MANUALE") 
        {
            _modalitaIrrigazione.text("AUTOMATICO");
            _tabAutomatico.show();
            _btnAccendi.hide();
            _btnSpegni.hide();
        }
        else
        {
            _tabAutomatico.hide();
            _modalitaIrrigazione.text("MANUALE");
            _btnAccendi.show();
            _btnSpegni.show();
        }
    });

    _btnAccendi.on("click", function () {
        if (_btnAccendi.css("background-color") == "red") {
            _btnAccendi.css({"background-color": "green", "border-color": "green"});
        }
        else
        _btnSpegni.css({"background-color": "red", "border-color": "red"});
    });

    _btnSpegni.on("click", function () {
        if (_btnSpegni.css("background-color") == "red") {
            _btnSpegni.css({"background-color": "green", "border-color": "green"});
        }
        else
        _btnAccendi.css({"background-color": "red", "border-color": "red"});
    });

    //prendo dati dal db

    let tipo = "temperatura";
    let rq = inviaRichiesta("POST", "/api/prendidati")
    rq.then(function (response) {
        //controlloData(response);
        creaChart(response);
        riempiCampi(response);
        console.log(response)
    })
    rq.catch(function (err) {
        if (err.response.status == 401) {
            _lblErrore.show();
        }
        else
            errore(err);
    })



    function riempiCampi(response) {
        for (let item of response.data) {
            if (item.tipo == "temperatura") {
                let valoreTemperatura = item.valori[item.valori.length - 1].dato;
                console.log(valoreTemperatura);
                let length = valoreTemperatura.length;
                _rilevamenti.children().eq(0).text(valoreTemperatura + "°C");
            }
            else if (item.tipo == "umiditaAria") {
                let umiditaAria = item.valori[item.valori.length - 1].dato;
                console.log(umiditaAria);
                let length1 = umiditaAria.length;
                _rilevamenti.children().eq(1).text(umiditaAria + "%");
            }
        }



    }

    function creaChart(response) {
        let data = [];

        let valoreTemperatura = [];
        let umiditaAria = [];

        for (let item of response.data) {
            if (item.tipo == "temperatura") {
                //prendo i dati della temperatura e della data che userò anche per la data dell'umidità
                for (let valore of item.valori) {
                    valoreTemperatura.push(valore.dato);
                    data.push(valore.ora);
                }
            }
            else if (item.tipo == "umiditaAria") {
                //prendo i dati dell'umidità senza data tanto è all'incirca uguale alla temperatura
                for (let valore of item.valori) {
                    umiditaAria.push(valore.dato);
                }
            }
        }



        console.log(valoreTemperatura, data);

        //se i dati sono più di 12 li taglio
        if (valoreTemperatura.length > 12) {
            valoreTemperatura = valoreTemperatura.slice(valoreTemperatura.length - 12);
        }
        if (umiditaAria.length > 12) {
            umiditaAria = umiditaAria.slice(umiditaAria.length - 12);
        }
        if (data.length > 12) {
            data = data.slice(data.length - 12);
        }
        const ctx = $("#myChart")

        //['5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60']

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data,
                datasets: [{
                    label: 'Temperatura',
                    data: valoreTemperatura,
                    borderWidth: 1
                },
                {
                    label: 'Umidità',
                    data: umiditaAria,
                    borderWidth: 1
                }]
            },
            options: {

                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },

            }
        });

    }



    /*function controlloData(response) {
        let dati = [];
        for (let item of response.data) {
            if(item.tipo=="temperatura")
            {
                if (item.valori[item.valori.length - 1].data != new Date().toLocaleDateString()) {    
                    let rq = inviaRichiesta("POST", "/api/aggiornaStorico", );
                    rq.then(function (response) {
                        console.log(response);
                    })
                    rq.catch(function (err) {
                        if (err.response.status == 401) {
                            _lblErrore.show();
                        }
                        else
                            errore(err);
                    })
                }
            }
        }
    }*/

    let _impostaIrrigazione = $("#irriga");
    _impostaIrrigazione.on("click", function () {
        swal({
            text: 'Search for a movie. e.g. "La La Land".',
            content: "input",
            button: {
                text: "Search!",
                closeModal: false,
            },
        })
    });

});
