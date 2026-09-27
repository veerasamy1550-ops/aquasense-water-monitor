# AquaSense Water Quality Monitor

ESP32 + Node.js + MongoDB Atlas + responsive web dashboard.

## Deploy on Render

1. Create a MongoDB Atlas database.
2. Push this folder to GitHub.
3. Create a Render Web Service from the GitHub repository.
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   - `MONGODB_URI`
   - `ESP32_API_KEY`
7. Deploy.
8. Copy the Render URL into `esp32/esp32_water_monitor.ino`.
9. Replace demo sensor values with calibrated sensor readings.

The dashboard displays physical-parameter screening only; it does not certify drinking-water safety.
