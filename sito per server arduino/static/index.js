
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
    let _btnStato = $("#btnStato");
    let modIrr = "";
    let _selectStorico = $("#selectStorico");
    let myChartix;

    const ctx = $("#myChart");


    //impostazioni di avvio
    _paginaIniziale.show().css("margin-top", "flex");
    _paginaDati.hide();
    _progetto.hide();
    _indietro.hide();

    _btnStato.hide();

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
        if (_modalitaIrrigazione.text() == "MANUALE") {
            _modalitaIrrigazione.text("Caricamento...");
            aggiornoDb("AUTOMATICO");
        }
        else {
            _modalitaIrrigazione.text("Caricamento...");
            aggiornoDb("MANUALE");
        }
    });

    _btnStato.on("click", function () {
        if (_btnStato.text() == "ACCENDI") {
            _btnStato.text("SPEGNI").css({ "background-color": "red", "border-color": "red" });
            swal("HAI ACCESO L'IRRIGAZIONE", "", "success");
        }
        else {
            _btnStato.text("ACCENDI").css({ "background-color": "green", "border-color": "green" });;
            swal("HAI SPENTO L'IRRIGAZIONE", "", "success");
        }
    });

    _selectStorico.on("change", function () {
        myChartix.destroy();
        let rq = inviaRichiesta("POST", "/api/prendiStorico")
        rq.then(function (response) {
            creaChart(response);
        })
        rq.catch(function (err) {
            if (err.response.status == 401) {
                _lblErrore.show();
            }
            else
                errore(err);
        })
    })

    //prendo dati dal db
    //prendo le date dello storico per vedere se posso usare la select o no
    let dateStorico = [];
    let rq = inviaRichiesta("POST", "/api/prendiStorico")
    rq.then(function (response) {
        console.log(response);
        let vediDataUguale;
        for (let item of response.data) {
            if (vediDataUguale != item.data) {
                dateStorico.push(item.data);
                vediDataUguale = item.data;
            }
        }
        if (dateStorico.length == 0) {
            _selectStorico.hide();
        }
        else {
            for (let item of dateStorico) {
                if (item == new Date().toLocaleDateString()) 
                {
                    $("<option>").text("Ieri").val(item).appendTo(_selectStorico);
                }
                else
                {
                    $("<option>").text(item).val(item).appendTo(_selectStorico);
                }
            }
            _selectStorico.prop("selectedIndex", -1);
        }
    })
    rq.catch(function (err) {
        if (err.response.status == 401) {
            _lblErrore.show();
        }
        else
            errore(err);
    })



    //prendo dati per il grafico
    let tipo = "temperatura";
    rq = inviaRichiesta("POST", "/api/prendidati")
    rq.then(function (response) {
        //controlloData(response);
        creaChart(response);
        riempiCampi(response);
    })
    rq.catch(function (err) {
        if (err.response.status == 401) {
            _lblErrore.show();
        }
        else
            errore(err);
    })

    //prendo azioni
    rq = inviaRichiesta("POST", "/api/prendiazioni")
    rq.then(function (response) {
        //controlloData(response);
        riempioAzioni(response);
        console.log(response)
    })
    rq.catch(function (err) {
        if (err.response.status == 401) {
            _lblErrore.show();
        }
        else
            errore(err);
    })

    function riempioAzioni(response) {
        for (let action of response.data) {
            if (action.tipo == "irrigazione") {
                modIrr = action.modalita;
                _modalitaIrrigazione.text(modIrr.toUpperCase());

                if (_modalitaIrrigazione.text() == "MANUALE") {
                    if (action.acceso == false) {
                        _btnStato.text("ACCENDI").css({ "background-color": "green", "border-color": "green" }).show();
                    }
                    else {
                        _btnStato.text("SPEGNI").css({ "background-color": "red", "border-color": "red" }).show();
                    }
                    _tabAutomatico.hide();

                }
                else {
                    _tabAutomatico.show();
                    _btnStato.hide();
                }
            }
        }
    }

    function aggiornoDb(modalita) {
        let rq = inviaRichiesta("POST", "/api/aggiornamodalita", { "modalita": modalita });
        rq.then(function (response) {
            console.log(response);
            if (modalita == "MANUALE") {
                _tabAutomatico.hide();
                _modalitaIrrigazione.text("MANUALE");
                _btnStato.show();
            }
            else {
                _modalitaIrrigazione.text("AUTOMATICO");
                _tabAutomatico.show();
                _btnStato.hide();
            }
        })
        rq.catch(function (err) {
            if (err.response.status == 401) {
                _lblErrore.show();
            }
            else
                errore(err);
        })
    }



    function riempiCampi(response) {
        let stile = { "font-size": "15pt", "color": "black", "font-weight": "bold", "width": "100%" }
        for (let item of response.data) {
            if (item.tipo == "temperatura") {
                let valoreTemperatura = item.valori[item.valori.length - 1].dato;
                console.log(valoreTemperatura);
                _rilevamenti.children().eq(0).text(valoreTemperatura + "°C");
                $("<span>").text("TEMPERATURA").appendTo(_rilevamenti.children().eq(0)).css(stile)
            }
            else if (item.tipo == "umiditaAria") {
                let umiditaAria = item.valori[item.valori.length - 1].dato;
                console.log(umiditaAria);
                _rilevamenti.children().eq(1).text(umiditaAria + "%");
                $("<span>").text("HUM ARIA").appendTo(_rilevamenti.children().eq(1)).css(stile)
            }
            else if (item.tipo == "umiditaTerra") {
                let umiditaTerra = item.valori[item.valori.length - 1].dato;
                console.log(umiditaTerra);
                _rilevamenti.children().eq(2).text(umiditaTerra + "%");
                $("<span>").text("HUM TERRA").appendTo(_rilevamenti.children().eq(2)).css(stile)
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

        let config = {
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
        };
        myChartix = new Chart(ctx, config);

        //['5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60']
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