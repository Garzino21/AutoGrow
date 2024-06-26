//librerie per collegamento alla rete e server semplice
#include <WiFiS3.h>
#include <WiFiServer.h>

//nome e password del wi fi
#include "secrets.h"

//funzione invio dati pagina
#include "pagina.h"

//funzionamento del sensore
#include <DHT.h>

//porta
WiFiServer server(80);

//2=pin data
DHT dht(2, DHT11);

void setup() {
  dht.begin();
  Serial.begin(115200);
  delay(1000);
  Serial.println("Simple Server");

  //controllo stato connessione
  WiFi.begin(MY_WIFI_SSID, MY_WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  Serial.print("\n");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
  server.begin();
}

void loop() {
  WiFiClient client = server.available();
  if (client) {
    Serial.println("new req");
    String line = "";
    while (client.connected()) {
      if (client.available()) {
        char c = client.read();
        Serial.print(c);
        if (c == '\n') {
          if (line.length() == 0) {
            //recupero dati sensore
            float t = tempSens();
            int h = humSens();

            //mando dati a client
            printPage(client, t, h);
            break;
          }
          line = "";

        } else if (c != '\r') {
          line += c;
        }
      }
    }
    client.stop();
    Serial.println("client scollegato");
  }
}

float tempSens() {
float t = dht.readTemperature();
  Serial.println("La temperatura è di: " + String(t));
  return t;
}

int humSens() {
  int h = dht.readHumidity();
  Serial.println("Hai un umidità di: " + String(h) + "%");
  return h;
}
