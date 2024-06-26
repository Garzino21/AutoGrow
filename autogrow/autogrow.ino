#include <WiFiS3.h>
#include <DHT.h>

// Definizioni DHT
#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

//imposto millis
unsigned long previousMillisSensori = 0;      // Variabile per memorizzare il tempo dell'ultimo aggiornamento
const long intervalSensori = 3000;            // Intervallo desiderato in millisecondi (1 secondo)
unsigned long previousMillisIrrigazione = 0;  // Variabile per memorizzare il tempo dell'ultimo aggiornamento
const long intervalIrrigazione = 300000;      // Intervallo desiderato in millisecondi (1 secondo)

// Credenziali WiFi
const char ssid[] = "MicsoWadsl-w0101159";
const char pass[] = "mafizama76";
//const char ssid[] = "Rete davide";
//const char pass[] = "davidealessia";

//variabili per sensore terra e lettura analogica e scrittura pin
int IN1 = 3;
int IN2 = 4;
int IN3 = 5;
int IN4 = 6;

int Pin1 = A0;
int Pin2 = A1;
int Pin3 = A2;
int Pin4 = A3;

float value1 = 0;
float value2 = 0;
float value3 = 0;
float value4 = 0;

char statoIrrigazione = 'f';
int mod;
float value5 = 0;

// Client HTTP
WiFiClient client;
IPAddress serverIP(192, 168, 1, 32);  //casa
//char serverIP[] = "autogrowweb.onrender.com";  // hostname of web server:
//IPAddress serverIP(192,168,43,23);
const int HTTP_PORT = 3000;
const String HTTP_METHOD = "GET";  // o POST

void setup() {
  // Inizializzazione Serial Monitor
  Serial.begin(9600);
  // Inizializzazione DHT Sensor
  dht.begin();
  // Connessione WiFi
  connectToWiFi();

  pinMode(IN1, OUTPUT);
  pinMode(Pin1, INPUT);
  digitalWrite(IN1, HIGH);
}

void loop() {
  unsigned long currentMillisSensori = millis();      // Leggi il tempo attuale
  unsigned long currentMillisIrrigazione = millis();  // Leggi il tempo attuale

  // Verifica se è passato l'intervallo desiderato
  if (currentMillisSensori - previousMillisSensori >= intervalSensori) {
    // Salva il tempo dell'ultimo aggiornamento
    previousMillisSensori = currentMillisSensori;
    // Esegui l'azione che vuoi fare dopo l'intervallo di tempo
    sendSensorDataToHTTP();
  }

  if (currentMillisIrrigazione - previousMillisIrrigazione >= intervalIrrigazione) {
    // Salva il tempo dell'ultimo aggiornamento
    previousMillisIrrigazione = currentMillisIrrigazione;
    // Esegui l'azione che vuoi fare dopo l'intervallo di tempo
    //sendSensorDataToHTTP();
    Serial.println("---------");
    Serial.println("CHEIDO COSA FARE");
    irrigazioneRichiesta();
  }

  if (statoIrrigazione == 't') {
    Serial.println("ovvio");
    digitalWrite(IN1, LOW);
  } else {
    digitalWrite(IN1, HIGH);
  }

  Serial.print(mod);

  float humT1 = analogRead(Pin1);
  float humT2 = analogRead(Pin2);
  float humT = (humT1 + humT2) / 2;

  switch (mod) {
    case 0:
      break;
    case 1:
      if (humT >= 100 && humT <= 400)
        statoIrrigazione = 't';
      else
        statoIrrigazione = 'f';
      break;
    case 2:
      if (humT >= 300 && humT <= 600)
        statoIrrigazione = 't';
      else
        statoIrrigazione = 'f';

      break;
    case 3:
      if (humT >= 500 && humT <= 800)
        statoIrrigazione = 't';
      else
        statoIrrigazione = 'f';
      break;
  }
}

void connectToWiFi() {
  Serial.print("Connecting to ");
  Serial.println(ssid);

  while (WiFi.status() != WL_CONNECTED) {
    WiFi.begin(ssid, pass);
    delay(10000);  // Attesa di 10 secondi per la connessione
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi connected.");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void sendSensorDataToHTTP() {
  float temperature = dht.readTemperature();
  int humidity = dht.readHumidity();
  float humT1 = analogRead(Pin1);
  float humT2 = analogRead(Pin2);

  float humT = (humT1 + humT2) / 2;

  if (client.connect(serverIP, HTTP_PORT)) {
    String queryString = "?temp=" + String(temperature) + "&hum=" + String(humidity) + "&humT=" + String(humT);
    client.println(HTTP_METHOD + " /api/inviadati" + queryString + " HTTP/1.1");
    client.println("Host: " + String(serverIP));
    client.println("Connection: close");
    client.println();

    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        Serial.print(c);
      }
    }

    client.stop();
  } else {
    Serial.println("Connection to server failed.");
  }
}

void irrigazioneRichiesta() {
  if (client.connect(serverIP, HTTP_PORT)) {
    client.println(HTTP_METHOD + " /api/irrigazioneRichiesta" + " HTTP/1.1");
    client.println("Host: " + String(serverIP));
    client.println("Connection: close");
    client.println();

    char risposta = 0;
    char risposta2;
    char risposta3;
    char risposta4;
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        Serial.print(c);
        risposta = c;
      }
    }

    Serial.print("risposta: ");
    Serial.println(risposta);

    switch (risposta) {
      case 't':
        statoIrrigazione = 't';
        break;
      case '0':
        statoIrrigazione = 't';
        mod = 0;
        break;
      case '1':
        statoIrrigazione = 't';
        mod = 1;
        break;
      case '2':
        statoIrrigazione = 't';
        mod = 2;
        break;
      case '3':
        statoIrrigazione = 't';
        mod = 3;
        break;
      case 'f':
        statoIrrigazione = 'f';
        break;
      case '4':
        statoIrrigazione = 'f';
        mod = 0;
        break;
      case '5':
        statoIrrigazione = 'f';
        mod = 1;
        break;
      case '6':
        statoIrrigazione = 'f';
        mod = 2;
        break;
      case '7':
        statoIrrigazione = 'f';
        mod = 3;
        break;
    }

    client.stop();
  } else {
    Serial.println("Connection to server failed.");
  }
}