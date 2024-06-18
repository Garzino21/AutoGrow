# AutoGrow


BREVE DESCRIZIONE DEL PROGETTO E DEL FUNZIONAMENTO

Auto Grow è un progetto innovativo nato con l'obiettivo di rendere l'arte della semina e della cura delle piante accessibile e semplice per tutti. Grazie ad Auto Grow, prendersi cura delle piante non sarà più un'attività noiosa, poiché il processo di irrigazione e cura del terreno è completamente automatizzato. Con Auto Grow, non vedrai l'ora di vedere crescere le tue piante!
Auto Grow ottimizza l'uso dell' acqua, rendendo l'irrigazione il più efficiente possibile. Il sistema è dotato di una serie di sensori che monitorano costantemente il terreno. In base ai dati raccolti, il sistema decide se e quanto irrigare. Dal sito web, è possibile monitorare lo stato del terreno e modificare le impostazioni di irrigazione. Con semplici comandi, è possibile attivare o disattivare l'irrigazione automatica o passare alla modalità manuale.
Auto Grow è progettato per essere estremamente facile da usare, consentendo a chiunque di godere dei benefici di avere un giardino in casa. Il design compatto permette di posizionarlo in qualsiasi ambiente, rendendolo ideale per ogni tipo di spazio.

SPIEGAZIONE PARTI DEL SITO

![image](https://github.com/Garzino21/AutoGrow/assets/92369567/f02dd244-835d-4be5-b735-f8d87f650e74)

In questa immagine sono visualizzati i dati attuali relativi a una mini serra. Le informazioni sono organizzate in quattro riquadri:

Temperatura: Il primo riquadro mostra la temperatura attuale all'interno della serra.
Umidità dell'aria: Il secondo riquadro indica l'umidità relativa dell'aria nella serra.
Umidità del terreno (Hterra): Il terzo riquadro visualizza l'umidità del terreno.
Ora attuale: L'ultimo riquadro mostra l'ora corrente.

![image](https://github.com/Garzino21/AutoGrow/assets/92369567/5884d303-ff71-4778-a0ad-77c4278e14ee)

Dati Visualizzati:
Linea Blu (Temperatura): Mostra i valori della temperatura nel tempo.
Linea Rosa (Umidità): Mostra i valori dell'umidità dell'aria.

Intervallo di Tempo:
Il selettore in alto a destra è impostato su un intervallo di "10 min", il che significa che il grafico sta mostrando dati raccolti negli ultimi 10 minuti.
L'asse del tempo (asse X) mostra le ore specifiche in cui le misurazioni sono state effettuate.

![Screenshot 2024-05-24 091156](https://github.com/Garzino21/AutoGrow/assets/92369567/eadf13fc-a5be-44be-a790-0a7960976bc4)

![image](https://github.com/Garzino21/AutoGrow/assets/92369567/4c27d080-8195-4989-9824-9be7fc5b72de)

Irrigazione Manuale
Descrizione: L'irrigazione manuale ti permette di controllare direttamente quando e quanto irrigare le piante. Questo avviene grazie a una pompa alimentata a 1,5 volt.
Vantaggi: Ti consente di monitorare visivamente le condizioni delle piante e di adattare l'irrigazione in base alle necessità immediate.
Irrigazione Automatica
Descrizione: L'irrigazione automatica utilizza sensori e un sistema di controllo che regola automaticamente l'erogazione dell'acqua. I sensori monitorano l'umidità del terreno e, quando rilevano che l'umidità è sotto un certo livello, attivano il sistema di irrigazione per fornire l'acqua necessaria.
Vantaggi: Questo metodo garantisce che le piante ricevano sempre l'acqua necessaria senza bisogno di intervento manuale costante. È particolarmente utile quando non sei presente per monitorare le piante o durante periodi di vacanza.

![image](https://github.com/Garzino21/AutoGrow/assets/92369567/e7ba71ab-d460-4051-8263-1875e44f38ac)

![image](https://github.com/Garzino21/AutoGrow/assets/92369567/48ae4b55-36b3-4836-9059-71f5c54b892b)

Visualizzazione Settimanale: La sezione meteo mostra le previsioni del tempo per ciascun giorno della settimana in un formato chiaro e intuitivo. Ogni giorno della settimana è rappresentato con un'icona e una breve descrizione delle condizioni meteorologiche previste (ad esempio, soleggiato, pioggia, nuvoloso, ecc.).

Interazione: Quando clicchi su uno dei giorni della settimana, viene visualizzata una finestra dettagliata che mostra il meteo specifico per il giorno selezionato.

![image](https://github.com/Garzino21/AutoGrow/assets/92369567/cdd7a671-a55e-46e5-b933-a35db0cc23bb)

![image](https://github.com/Garzino21/AutoGrow/assets/92369567/612bc092-8a55-4784-8934-fc140e3e8d88)

Lato assistenza:
Consigli per l'Agricoltura: La chat offre anche suggerimenti e consigli su vari aspetti dell'agricoltura, come l'irrigazione, la fertilizzazione, la gestione delle malattie delle piante e altro.

Esempio di Domande:
"Quanta acqua devo dare alle mie piante oggi?"
"Qual è il miglior fertilizzante per le mie piante?"
"Come posso prevenire le malattie comuni nelle mie colture?"

![image](https://github.com/Garzino21/AutoGrow/assets/92369567/f3c657d2-872e-4b2c-b3e3-7cf9940206fc)

vi è una sezione inerente alle notizie dell'ultimo mese riguardanti l'agricoltura

![image](https://github.com/Garzino21/AutoGrow/assets/92369567/09b8b8ea-4ccb-4a96-8cbc-a445a563974c)

Infine ce una pagina dedicata alla presentazione del progetto


HARDWARE UTILIZZATO

Per il mio progetto, ho impiegato una selezione accurata di componenti hardware per garantire un funzionamento ottimale e affidabile:

- Pompa a immersione da 3 volt alimentata a 1,5 volt: Essenziale per il sistema di irrigazione automatica, garantisce un flusso d'acqua costante e controllato.
- Scheda Arduino: Il cuore del sistema, programmata per gestire e coordinare tutte le operazioni basate sui dati ricevuti dai sensori.
- Cavi vari: Utilizzati per le connessioni interne, assicurano una trasmissione efficiente e sicura dei segnali tra i componenti.
- Scheda di relè normalmente chiusi: Cruciale per il controllo della pompa, consente l'attivazione e la disattivazione automatica dell'irrigazione.
- Sensore DHT11: Misura l'umidità e la temperatura dell'ambiente, fornendo dati vitali per ottimizzare le condizioni di crescita delle piante.
- Batteria da 9 volt: Fornisce un'alimentazione stabile e duratura al sistema.
- Sensore di umidità del terreno: Rileva l'umidità del suolo, permettendo alla scheda Arduino di decidere quando attivare la pompa per irrigare le piante.

SOFTWARE E TECNOLOGIE UTILIZZATE

Per il mio progetto, ho utilizzato i seguenti software, e tecnologie:

- Node.js: Utilizzato come server, offre una piattaforma robusta e scalabile per gestire le operazioni di backend.
- MongoDB: Scelto come sistema di gestione del database, permette un'archiviazione flessibile e performante dei dati.
- API key per le chiamate a Chat GPT: Integrate per sfruttare le potenzialità dell'intelligenza artificiale nella gestione e nell'ottimizzazione delle operazioni del sistema.
- API key per il meteo: Utilizzate per ottenere dati meteorologici aggiornati, contribuendo a rendere il sistema di irrigazione ancora più efficiente e reattivo alle condizioni ambientali.
- API key per le notizie sull'agricoltura
- JSON Web Token (JWT): Implementato per garantire la sicurezza e l'autenticazione degli utenti, assicurando un accesso sicuro alle funzionalità del sistema
- SweetAlert: Utilizzato per creare avvisi modali accattivanti e user-friendly, migliorando l'interattività e l'esperienza utente.
- Chart.js: Integrato per visualizzare i dati in modo dinamico e accattivante, attraverso grafici interattivi e personalizzabili.
- Cloudinary: Utilizzato per la gestione delle immagini, permettendo un'archiviazione, trasformazione e ottimizzazione efficiente delle risorse multimediali.

LINGUAGGI UTILIZZATI

Per il mio progetto, ho utilizzato i seguenti linguaggi, scelti per la loro versatilità e capacità di creare un sistema efficiente e intuitivo:

- HTML: Per la struttura e il contenuto delle pagine web.
- CSS: Per la stilizzazione e il design, garantendo un'interfaccia utente piacevole ed ergonomica.
- jQuery: Per semplificare la manipolazione del DOM e migliorare l'interattività del sito.
- TypeScript: Per scrivere codice JavaScript più robusto e mantenibile, grazie alla sua tipizzazione statica.
- C: Utilizzato per la programmazione a basso livello, essenziale per il controllo diretto dell'hardware e l'ottimizzazione delle prestazioni del sistema.

RIFERIMENTI A SITI TERZI

Ecco il riferimento a:

Node.js: https://nodejs.org 

MongoDB: https://www.mongodb.com

OpenAI API (Chat GPT): https://openai.com/api/

Weather API: https://www.weatherapi.com/

JSON Web Token (JWT): https://jwt.io/

SweetAlert: https://sweetalert.js.org/

Chart.js: https://www.chartjs.org/

Cloudinary: https://cloudinary.com/

RIFERIMENTO AL PADLET DI PRESENTAZIONE: https://padlet.com/dgarzino2248/autogrow-project-1u3p9pfhrq4hgd8h
