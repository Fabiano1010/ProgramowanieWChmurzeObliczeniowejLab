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