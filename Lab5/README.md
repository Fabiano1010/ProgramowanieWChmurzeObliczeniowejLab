# Programowanie Aplikacji w Chmurze Obliczeniowej

## Laboratorium 5

### WIELOETAPOWE BUDOWANIE OBRAZÓW

**Fabian Skrzypczyński**  
**Grupa dziekańska:** 6.8  
**Numer albumu:** 101664  
**Prowadzący laboratorium:** mgr inż. Karol Łazaruk

Lublin 2026

---

## Dockerfile

```dockerfile
FROM scratch AS builder
ARG VERSION=1.0.0
ADD alpine-minirootfs-3.21.3-aarch64.tar /
RUN apk add --no-cache nodejs npm go
WORKDIR /app
COPY index.js .
RUN echo "<html><body> \
  <h1>Informacje o serwerze</h1> \
  <p><b>wersja aplikacji:</b> ${VERSION}</p> \
  <p><b>Hostname:</b> ${hostname}</p> \
  <p><b>Data buildu:</b> ${date}</p> \
  </body></html>" > index.html

FROM nginx:alpine
COPY --from=builder /app/index.html /usr/share/nginx/html/index.html
COPY --from=builder /app/index.js /usr/share/nginx/html/index.js

HEALTHCHECK --interval=10s --timeout=3s \
  CMD wget -qO- http://localhost/ || exit 1

EXPOSE 80
```
## index.js
```javascript
const express = require('express');
const os = require('os');

const app = express();
const PORT = 8080;

const VERSION = process.env.APP_VERSION || 'unknown';

app.get('/', (req, res) => {
  const ipAddresses = Object.values(os.networkInterfaces())
    .flat()
    .filter(details => details.family === 'IPv4' && !details.internal)
    .map(details => details.address);
  
  const hostname = os.hostname();
  
  res.json({
    server_ip: ipAddresses[0],
    hostname: hostname,
    version: VERSION
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Version: ${VERSION}`);
});

```
## Budowanie obrazu
```bash
docker build --build-arg VERSION=0.0.1 -t app1:v0.0.1 .
```
## Włączanie kontenera
```bash
docker run -d -p 8080:80 --name app app1:v0.0.1
```
## Zrzuty ekranu
### Polecenie uruchamiające i wynik
<img width="605" height="36" alt="obraz" src="https://github.com/user-attachments/assets/7a84772c-314c-43dd-9110-f997b040bb63" />

### Działający kontener
<img width="605" height="32" alt="obraz" src="https://github.com/user-attachments/assets/451ca518-ae70-458e-8a96-a40a1ddea31b" />

### Działający kontener
<img width="605" height="62" alt="obraz" src="https://github.com/user-attachments/assets/f040fa4c-a368-4f1e-b412-56dce3f059ef" />

### Strona pod adresem localhost:8080
<img width="605" height="340" alt="obraz" src="https://github.com/user-attachments/assets/9e006855-2d29-4122-8427-da862e540c1a" />



