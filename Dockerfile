FROM alpine:3.20

RUN apk add --no-cache lighttpd

COPY ./ /var/www/localhost/htdocs

EXPOSE 80

CMD ["lighttpd","-D","-f","etc/lighttpd/lighttpd.conf"]
