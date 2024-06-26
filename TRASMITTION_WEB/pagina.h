#ifndef _PAGINA_H_
#define _PAGINA_H_

void printPage(WiFiClient client, float t, int h) {
  client.println("HTTP/1.1 200 OK");
  client.println("Content-type:text/html");
  client.println("");
  client.println("<html style=\"height: 100%;\">");
  client.println("<head><meta name=\"viewport\" content=\"width=device-width, user-scalable=no,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0\"></head>");
  client.println("<body style=\"height: 100%;overflow-y:hidden;\">");
  client.println("<div id=\"wrapper\" style=\"text-align: center; width: 100%; height:100%; margin:auto; padding-top: 10%;\">");
  client.println("<h2 style=\"text-align: center; font-family: sans-serif; color: lightblue;\">TEMPERATURE</h2>");
  client.println("<div style=\"text-align: center; border: 4px solid lightblue; width: 300px; height: 100px;margin:auto; margin-bottom: 6px;  margin-top: 6px; border-radius: 20px; background-color: azure; font-family: sans-serif; font-size: 35pt; padding-top: 25px;\">" + String(t) + "&#186</div>");
  client.println("<h2 style=\"text-align: center; font-family: sans-serif; color: lightblue;\">HUMIDITY</h2>");
  client.println("<div style=\"text-align: center; border: 4px solid lightblue; width: 300px; height: 100px; margin:auto; margin-bottom: 6px;  margin-top: 6px; border-radius: 20px; background-color: azure; font-family: sans-serif; font-size: 35pt; padding-top: 25px;\">" + String(h) + "%</div>");
  client.println("</div>");
  client.println("</body>");
  client.println("</html>");
}
#endif