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


    //impostazioni di avvio
    _paginaIniziale.show().css("margin-top", "flex");
    _paginaDati.hide();
    _progetto.hide();
    _indietro.hide();

    //gestione eventi
    _apri.on("click",function () {
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

    //prendo dati dal db

    let tipo = "temperatura";
    let rq = inviaRichiesta("POST", "/api/prendidati",)
    rq.then(function (response) {
        creaChart(response);
        riempiCampi(response);
        console.log(response.data)
    })
    rq.catch(function (err) {
        if (err.response.status == 401) {
            _lblErrore.show();
        }
        else
            errore(err);
    })

    function riempiCampi(response) {
        let valoreTemperatura = response.data[0].valori;
        console.log(valoreTemperatura);
        let length = valoreTemperatura.length;
        _rilevamenti.children().eq(0).text(valoreTemperatura[length-1] + "°C");
    }

    function creaChart(response) {
        let valoreTemperatura = response.data[0].valori;
        console.log(valoreTemperatura);
        const ctx = $("#myChart")

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['5', '10', '15', '20', '25', '30','35', '40', '45', '50', '55', '60'],
                datasets: [{
                    label: 'Temperatura',
                    data: valoreTemperatura,
                    borderWidth: 1
                },
                {
                    label: 'Umidità',
                    data: [],
                    borderWidth: 1
                }]
            },
            options: {
                
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

});
