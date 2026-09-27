#include <WiFi.h>
#include <HTTPClient.h>

const char* WIFI_SSID = "YOUR_WIFI";
const char* WIFI_PASSWORD = "YOUR_PASSWORD";
const char* API_URL = "https://YOUR-RENDER-APP.onrender.com/api/readings";
const char* API_KEY = "YOUR_ESP32_API_KEY";

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) delay(500);
}

void loop() {
  // Replace these demo values with your calibrated sensor readings.
  float temperature = 28.4;
  float ph = 7.24;
  float turbidity = 0.72;
  float tds = 318;

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(API_URL);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("x-api-key", API_KEY);

    String json = "{\"deviceId\":\"ESP32-WATER-01\",";
    json += "\"temperature\":" + String(temperature,2) + ",";
    json += "\"ph\":" + String(ph,2) + ",";
    json += "\"turbidity\":" + String(turbidity,2) + ",";
    json += "\"tds\":" + String(tds,2) + "}";

    Serial.println(http.POST(json));
    http.end();
  }

  delay(10000);
}