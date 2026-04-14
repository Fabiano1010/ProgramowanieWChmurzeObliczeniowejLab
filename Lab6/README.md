# Programowanie Aplikacji w Chmurze Obliczeniowej

## Laboratorium 6

### KONFIGURACJA I WYKORZYSTANIE CLI DLA USŁUG GITHUB

**Fabian Skrzypczyński**  
**Grupa dziekańska:** 6.8  
**Numer albumu:** 101664  
**Prowadzący laboratorium:** mgr inż. Karol Łazaruk

Lublin 2026
## Dockerfile

```dockerfile
FROM scratch AS builder
ARG VERSION=1.0.0
ADD alpine-minirootfs-3.21.3-aarch64.tar /
RUN apk add --no-cache nodejs npm go git openssh-client

RUN mkdir -p /root/.ssh && ssh-keyscan github.com >> /root/.ssh/known_hosts

WORKDIR /app

RUN --mount=type=ssh \
    git clone git@github.com:Fabiano1010/pawcho6.git /app/repo

COPY index.js .

RUN echo "<html><body> \
<h1>Informacje o serwerze</h1> \
<p><b>Wersja aplikacji:</b> ${VERSION}</p> \
<p><b>Hostname:</b> $(hostname)</p> \
<p><b>Data buildu:</b> $(date)</p> \
</body></html>" > index.html

FROM nginx:alpine
COPY --from=builder /app/index.html /usr/share/nginx/html/index.html
COPY --from=builder /app/index.js   /usr/share/nginx/html/index.js
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
### Generowanie kluczy

<img width="605" height="241" alt="obraz" src="https://github.com/user-attachments/assets/3d0460d3-8789-448f-819d-7c075299fc2f" />

### Wynik generacji klucza

<img width="605" height="215" alt="obraz" src="https://github.com/user-attachments/assets/93d5e3b1-1570-4381-9c9f-c29b8a25302e" />

### Uruchomienie serwisu

<img width="605" height="183" alt="obraz" src="https://github.com/user-attachments/assets/2d796280-59b9-4e30-b4a0-7616188b7cd0" />

### Rejestracja klucza w agencie SSH

<img width="605" height="59" alt="obraz" src="https://github.com/user-attachments/assets/1109156c-5f7f-466a-bc8e-dee7e2042015" />

### Wyświetlenie klucza publicznego

<img width="605" height="37" alt="obraz" src="https://github.com/user-attachments/assets/f77b56e8-c96e-47d8-9571-459464344599" />

### Potwierdzenie dodania klucza

<img width="605" height="220" alt="obraz" src="https://github.com/user-attachments/assets/d8be0724-8436-498a-9fc5-5482c3f106e6" />

### Logowanie do repozytorium

<img width="598" height="42" alt="obraz" src="https://github.com/user-attachments/assets/f1f76d76-6f0f-48e6-a760-a5bf3ea912be" />

### Budowa obrazu

<img width="605" height="178" alt="obraz" src="https://github.com/user-attachments/assets/e4c94e5f-a052-4ce8-8294-c86f8e8acfc5" />

### Gotowy pakiet

<img width="605" height="369" alt="obraz" src="https://github.com/user-attachments/assets/c0d456bb-4c66-47c0-be69-07eb274fa7ac" />

## Linki:
https://github.com/Fabiano1010/pawcho6/pkgs/container/pawcho6

https://github.com/Fabiano1010/pawcho6






