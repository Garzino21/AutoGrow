//migliorare il meteo problema icona nell menu hamburger
//click sul meteo vedere tutta la settimana in swal con le icone

//icone https://icons8.it/icon/set/meteo/fluency

//https://uiverse.io/

$(document).ready(function () {
    let stile = { "font-size": "15pt", "color": "black", "font-weight": "bold", "width": "100%" }
    //variabili
    let _paginaIniziale = $("#paginaIniziale");
    let _paginaDati = $("#paginaDati");
    let _progetto = $("#progetto");
    let _body = $("body");
    let _indietro = $("#indietro");
    let _rilevamenti = $("#rilevamenti");
    let _modalitaIrrigazione = $("#btnModalita");
    let _tabAutomatico = $("#tabAutomatico");
    let _btnStato = $("#btnStato");
    let modIrr = "";
    let _selectStorico = $("#selectStorico");
    let myChartix;
    let _navBar = $(".navb");
    let _monitora = $(".monitora");
    let _prog = $(".prog");
    let _home = $(".home");
    let _meteo = $("#meteo");
    let _tbody = $("#tbody");
    let _thead = $("#thead");

    _navBar.hide();

    const ctx = $("#myChart");

    //RIQUADRO ORARIO

    setInterval(function () {
        let spann = $("<span>").text("").appendTo(_rilevamenti.children().eq(3)).css(stile)
        let hours = new Date().getHours();
        let minutes = new Date().getMinutes();
        let seconds = new Date().getSeconds();
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        let oraAttuale = hours + ":" + minutes + ":" + seconds;
        _rilevamenti.children().eq(3).text(oraAttuale);
        spann = $("<span>").text("ORA ATTUALE").appendTo(_rilevamenti.children().eq(3)).css(stile)
    }, 1000);

    //impostazioni di avvio
    _paginaIniziale.show().css("margin-top", "flex");
    _paginaDati.hide();
    _progetto.hide();
    _btnStato.hide();

    //gestione eventi
    _meteo.on("click", function () {
        console.log("cliccato"+ _meteo.val());
        
        let dataDaCercare = _meteo.val();
        dataDaCercare = dataDaCercare.split("/");
        dataDaCercare = dataDaCercare[2] + "-" + dataDaCercare[1] + "-" + dataDaCercare[0];

        richiestaDatigiorno(dataDaCercare);

    });



    _monitora.on("click", function () {
        _paginaIniziale.hide();
        _progetto.hide();
        _paginaDati.show();
        _body.css("overflow-y", "scroll");
        _navBar.show();
        _monitora.addClass("active");
        _prog.removeClass("active");
        _home.removeClass("active");
    });

    _prog.on("click", function () {
        _progetto.show();
        _paginaIniziale.hide();
        _paginaDati.hide();
        _indietro.show();
        _body.css("overflow", "scroll");
        _navBar.show();
        _prog.addClass("active");
        _monitora.removeClass("active");
        _home.removeClass("active");
    })

    _home.on("click", function () {
        _paginaIniziale.show();
        _paginaDati.hide();
        _progetto.hide();
        _body.css("overflow", "hidden");
        _navBar.hide();
        _home.addClass("active");
        _prog.removeClass("active");
        _monitora.removeClass("active");
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
            Swal.fire("HAI ACCESO L'IRRIGAZIONE", "", "success");
        }
        else {
            _btnStato.text("ACCENDI").css({ "background-color": "green", "border-color": "green" });;
            Swal.fire("HAI SPENTO L'IRRIGAZIONE", "", "success");
        }
    });

    _selectStorico.on("change", function () {
        myChartix.destroy();
        if (_selectStorico.val() == new Date().toLocaleDateString()) {
            let rq = inviaRichiesta("POST", "/api/prendidati")
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
        }
        else {

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
        }
    })

    //prendo dati dal db
    //prendo il meteo

    meteoOggi();
    meteoSettimana();


    //prendo le date dello storico per vedere se posso usare la select o no
    let dateStorico = [];
    rq = inviaRichiesta("POST", "/api/prendiStorico")
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
            $("<option>").text("---Dati di oggi---").val(new Date().toLocaleDateString()).appendTo(_selectStorico);
            for (let item of dateStorico) {
                if (item == new Date().toLocaleDateString() - 1) {
                    $("<option>").text("Dati di ieri").val(item).appendTo(_selectStorico);
                }
                else {
                    $("<option>").text("Dati del " + item).val(item).appendTo(_selectStorico);
                }
            }
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
            /*else if (item.tipo == "umiditaTerra") {
                let umiditaTerra = item.valori[item.valori.length - 1].dato;
                console.log(umiditaTerra);
                _rilevamenti.children().eq(2).text(umiditaTerra + "%");
                $("<span>").text("HUM TERRA").appendTo(_rilevamenti.children().eq(2)).css(stile)
            }*/
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

    function datiAttuali(response) {
        let time = [];
        let precipitazioni = [];
        let nuvole = [];
        let day = [];

        for (let i = 0; i < 23; i++) {
            time.push(response.data.hourly.time[i]);
            precipitazioni.push(response.data.hourly.precipitation[i]);
            nuvole.push(response.data.hourly.cloud_cover[i]);
            day.push(response.data.hourly.is_day[i]);
        }

        let oraAttuale = new Date().getHours();
        _meteo.val(new Date().toLocaleDateString());

        if (precipitazioni[oraAttuale] > 2) {
            _meteo.prop("src", "img/pioggiaForte.png");
        }
        else if (precipitazioni[oraAttuale] >= 1 && precipitazioni[oraAttuale] <= 2) {
            _meteo.prop("src", "img/pioggiaForte.png");
        }
        else if (precipitazioni[oraAttuale] == 0) {
            if (day[oraAttuale] == 1) {
                if (nuvole[oraAttuale] >= 40 && nuvole[oraAttuale] < 70) {
                    _meteo.prop("src", "img/mezzaNuvola.png");
                }
                else if (nuvole[oraAttuale] >= 70) {
                    _meteo.prop("src", "img/nuvola.png");
                }
                else {
                    _meteo.prop("src", "img/sole.png");
                }
            }
            else {
                if (nuvole[oraAttuale] >= 40 && nuvole[oraAttuale] < 70) {
                    _meteo.prop("src", "img/mezzaNotte.png");
                }
                else if (nuvole[oraAttuale] >= 70) {
                    _meteo.prop("src", "img/nuvola.png");
                }
                else {
                    _meteo.prop("src", "img/notte.png");
                }
            }
        }
    }

    function datiSettimana(response) {
        let day = [];
        let precipitazioni = [];
        let tMax = [];
        let tMin = [];

        for (let i = 0; i < 7; i++) {
            day.push(response.data.daily.time[i]);
            precipitazioni.push(response.data.daily.precipitation_sum[i]);
            tMax.push(response.data.daily.temperature_2m_max[i]);
            tMin.push(response.data.daily.temperature_2m_min[i]);
        }

        let oggi = new Date().toLocaleDateString();


        for (let i = 0; i < 7; i++) {

            let td = $("<td>").appendTo(_tbody.children().eq(0)).val(day[i]).on("click", function () {
                richiestaDatigiorno($(this).val());
                console.log("giorno del valore "+$(this).val());

            });

            if (precipitazioni[i] > 15) {
                $("<img>").prop("src", "img/pioggiaForte.png").appendTo(td);
            }
            else if (precipitazioni[i] > 1 && precipitazioni[i] <= 15) {
                $("<img>").prop("src", "img/pioggiaLeggera.png").appendTo(td);
            }
            else if (precipitazioni[i] > 0 && precipitazioni[i] <= 1) {
                $("<img>").prop("src", "img/nuvola.png").appendTo(td);
            }
            else if (precipitazioni[i] == 0) {
                $("<img>").prop("src", "img/sole.png").appendTo(td);
            }

            td = $("<td>").text(tMin[i] + "° - ").appendTo(_tbody.children().eq(1)).css("color", "blue");
            $("<span>").text(tMax[i] + "°").appendTo(td).css("color", "red");

            //metto giorno della settimana

        }

        let dayName = new Date().toDateString();
        let giorniTotali = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        dayName = dayName.split(" ");
        dayName = dayName[0];
        let giorniOrdinati = [];

        for (let i = 0; i < 7; i++) {
            if (dayName == giorniTotali[i]) {
                giorniOrdinati.push(giorniTotali[i]);
                for (let j = i + 1; j < 7; j++) {
                    giorniOrdinati.push(giorniTotali[j]);
                }
                for (let j = 0; j < i; j++) {
                    giorniOrdinati.push(giorniTotali[j]);
                }
            }
        }
       

        for (let giorn of giorniOrdinati) {
            giorn=calcolaNomeGiorno(giorn);
            $("<td>").text(giorn).appendTo(_thead.children().eq(0));
        }


    }

    function calcolaNomeGiorno(giorn) {
        switch (giorn) {
            case "Sun":
                giorn = "Domenica";
                break;
            case "Mon":
                giorn = "Lunedì";
                break;
            case "Tue":
                giorn = "Martedì";
                break;
            case "Wed":
                giorn = "Mercoledì";
                break;
            case "Thu":
                giorn = "Giovedì";
                break;
            case "Fri":
                giorn = "Venerdì";
                break;
            case "Sat":
                giorn = "Sabato";
                break;
        }
        return giorn;
    }

    function meteoSettimana() {
        rq = inviaRichiesta("GET", "https://api.open-meteo.com/v1/forecast?latitude=44.6833200&longitude=7.2757100&daily=temperature_2m_max&daily=temperature_2m_min&daily=precipitation_sum&timezone=Europe%2FBerlin")
        rq.then(function (response) {
            datiSettimana(response);
        })
        rq.catch(function (err) {
            if (err.response.status == 401) {
                _lblErrore.show();
            }
            else
                errore(err);
        })
    }

    function meteoOggi() {
        let rq = inviaRichiesta("GET", "https://api.open-meteo.com/v1/forecast?latitude=44.6833200&longitude=7.2757100&hourly=cloud_cover&hourly=precipitation&hourly=is_day&timezone=Europe%2FBerlin")
        rq.then(function (response) {
            datiAttuali(response);
        })
        rq.catch(function (err) {
            if (err.response.status == 401) {
                _lblErrore.show();
            }
            else
                errore(err);
        })
    }

    function richiestaDatigiorno(giorno) {
        let rq = inviaRichiesta("GET", "https://api.open-meteo.com/v1/forecast?latitude=44.6833200&longitude=7.2757100&hourly=cloud_cover&hourly=precipitation&hourly=temperature&timezone=Europe%2FBerlin")
        rq.then(function (response) {
            RiempioSwal(response, giorno);
        })
        rq.catch(function (err) {
            if (err.response.status == 401) {
                _lblErrore.show();
            }
            else
                errore(err);
        })
    }

    function RiempioSwal(response, giornoScelto) {
        let giornoOggi = new Date().toLocaleDateString();


        let dayName = new Date(giornoScelto).toDateString();
        dayName = dayName.split(" ");
        dayName = dayName[0];
        dayName=calcolaNomeGiorno(dayName);

        giornoOggi = giornoOggi.split("/");
        giornoOggi = giornoOggi[0];

        giornoScelto = giornoScelto.split("-");
        giornoScelto = giornoScelto[2];
        console.log(giornoScelto, giornoOggi);

        

        let delay = giornoScelto - giornoOggi;
        let oreDiff = (delay * 24) - (delay * 1);

        console.log(oreDiff);

        let time = [];
        let precipitazioni = [];
        let nuvole = [];
        let temperatura = [];

        for (let i = oreDiff; i <= oreDiff + 24; i++) {
            time.push(response.data.hourly.time[i]);
            precipitazioni.push(response.data.hourly.precipitation[i]);
            nuvole.push(response.data.hourly.cloud_cover[i]);
            temperatura.push(response.data.hourly.temperature[i]);
        }
        console.log(time, precipitazioni, nuvole);

        let imgs = "";
        let temp="";
        let index = 0;
        for (let prec of precipitazioni) {
            if (index % 3 == 0 && index != 0) {
                if (prec >= 2) {
                    imgs += "<td><img src='img/pioggiaForte.png'></td>";
                }
                else if (prec >= 0.5 && prec < 2) {
                    imgs += "<td><img src='img/pioggiaLeggera.png'></td>";
                }
                else if (prec >= 0 && prec < 0.5) {
                    console.log("nuv" + nuvole[index], index);
                    if (nuvole[index] >= 40 && nuvole[index] < 70) {
                        imgs += "<td><img src='img/mezzaNuvola.png'></td>";
                    }
                    else if (nuvole[index] >= 70) {
                        imgs += "<td><img src='img/nuvola.png'></td>";
                    }
                    else if (nuvole[index] < 40) {
                        imgs += "<td><img src='img/sole.png'></td>";
                    }
                }
                temp+=`<td>${temperatura[index]}°C</td>`;
                console.log(imgs);
            }
            index++;
        }

        console.log(imgs);

        //imgs.push("<td><img src='img/pioggiaForte.png'></td>");

        let html = `<table id='tabSwal'>
        <thead>
          <tr>
            <td>00-2</td>
            <td>3-5</td>
            <td>6-8</td>
            <td>9-11</td>
            <td>12-14</td>
            <td>15-17</td>
            <td>18-20</td>
            <td>21-23</td>
          </tr>
        </thead>
        <tbody>
          <tr>
          ${imgs}
          </tr>
          <tr>
          ${temp}
          </tr>
        </tbody>
      </table>`;

        Swal.fire({
            title: `<i>Meteo di ${dayName}</i>`,
            html: html,
            background: "rgb(231, 255, 186)",
            width: "80%",
            heightAuto: "false",
            confirmButtonText: "OK",
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