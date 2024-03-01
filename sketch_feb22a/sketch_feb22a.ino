/*
 * Created by ArduinoGetStarted.com
 *
 * This example code is in the public domain
 *
 * Tutorial page: https://arduinogetstarted.com/tutorials/arduino-http-request
 */

#include <WiFiS3.h>

const char ssid[] = "Rete davide";
const char pass[] = "davidealessia";
//const char ssid[] = "Wadsl-Garzino";  // change your network SSID (name)
//const char pass[] = "mafizama76";   // change your network password (use for WPA, or use as key for WEP)

//http in lan locale
WiFiClient client;
int status = WL_IDLE_STATUS;
int HTTP_PORT = 80;
String HTTP_METHOD = "GET";  // or POST
char HOST_NAME[] = "192.168.43.23";
//char HOST_NAME[] = "192.168.1.32";// dove gira il server

int contatore = 0;

//https in esterna//
//WiFiSSLClient client;
//int status = WL_IDLE_STATUS;
//int HTTP_PORT =443; //importante porta 443 https
//String HTTP_METHOD = "POST";  // or POST
//char HOST_NAME[] = "garzinodavide.com";
//String PATH_NAME = "/api/dati";

void setup() {
  
  Serial.begin(9600);

  client = collegaWiFi();

  client = collegaServer();
    
}

void loop() {
  datiTemperatura(client);
  datiUmiditaAria(client);
  datiUmiditaTerra(client);

  // the server's disconnected, stop the client:
    client.stop();
    Serial.println();
    Serial.println("disconnected");
}

WiFiClient collegaServer() {
  // connect to web server on port 80:
  if (client.connect(HOST_NAME, HTTP_PORT)) {
    // if connected:
    Serial.println("Connected to server");
    // make a HTTP request:
    // send HTTP header
  } else {  // if not connected:
    Serial.println("connection failed");
  }
  return client;
}

WiFiClient collegaWiFi() {
  // check for the WiFi module:
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    // don't continue
    while (true)
      ;
  }

  String fv = WiFi.firmwareVersion();
  if (fv < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("Please upgrade the firmware");
  }

  // attempt to connect to WiFi network:
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
    status = WiFi.begin(ssid, pass);

    // wait 10 seconds for connection:
    delay(10000);
  }

  // print your board's IP address:
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  return client;
}

void datiTemperatura(WiFiClient client) {
  String PATH_NAME = "/api/inviadati";
  String queryString = String("?dato=13244523&tipo=temperatura");

  client.println(HTTP_METHOD + " " + PATH_NAME + queryString + " HTTP/1.1");
  client.println("Host: " + String(HOST_NAME));
  client.println("Connection: close");
  client.println();  // end HTTP header

  while (client.connected()) {
    if (client.available()) {
      // read an incoming byte from the server and print it to serial monitor:
      char c = client.read();
      Serial.print(c);
    }
  }
}

void datiUmiditaAria(WiFiClient client) {
  String PATH_NAME = "/api/inviadati";
  String queryString = String("?dato=1323&tipo=umiditaAria");
  client.println(HTTP_METHOD + " " + PATH_NAME + queryString + " HTTP/1.1");
  client.println("Host: " + String(HOST_NAME));
  client.println("Connection: close");
  client.println();  // end HTTP header

  while (client.connected()) {
    if (client.available()) {
      // read an incoming byte from the server and print it to serial monitor:
      char c = client.read();
      Serial.print(c);
    }
  }
}

void datiUmiditaTerra(WiFiClient client) {
  String PATH_NAME = "/api/inviadati";
  String queryString = String("?dato=4523&tipo=umiditaTerra");
  client.println(HTTP_METHOD + " " + PATH_NAME + queryString + " HTTP/1.1");
  client.println("Host: " + String(HOST_NAME));
  client.println("Connection: close");
  client.println();  // end HTTP header

  while (client.connected()) {
    if (client.available()) {
      // read an incoming byte from the server and print it to serial monitor:
      char c = client.read();
      Serial.print(c);
    }
  }
}
