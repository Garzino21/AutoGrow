#include <WiFiS3.h>
#include <DHT.h>

// Definizioni DHT
#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

//imposto millis
unsigned long previousMillisSensori = 0;      // Variabile per memorizzare il tempo dell'ultimo aggiornamento
const long intervalSensori = 10000;           // Intervallo desiderato in millisecondi (1 secondo)
unsigned long previousMillisIrrigazione = 0;  // Variabile per memorizzare il tempo dell'ultimo aggiornamento
const long intervalIrrigazione = 5000;        // Intervallo desiderato in millisecondi (1 secondo)

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

// Client HTTP
WiFiClient client;
IPAddress serverIP(192, 168, 1, 32);
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
  }
  else
  {
    Serial.println("ovvio che no");
    digitalWrite(IN1, HIGH);
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

  if (client.connect(serverIP, HTTP_PORT)) {
    String queryString = "?temp=" + String(22) + "&hum=" + String(22);
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

    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        Serial.print(c);
        statoIrrigazione = c;
      }
    }
    client.stop();
  } else {
    Serial.println("Connection to server failed.");
  }
}