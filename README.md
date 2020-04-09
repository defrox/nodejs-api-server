# nodejs-api-server

openssl pkcs12 -export -out cert.pkcs12 -in cert.pem

keytool -genkey -keyalg RSA -alias test -keystore truststore.jks

keytool -delete -alias test -keystore truststore.jks   

keytool -import -v -trustcacerts -alias local -file cert.pem -keystore truststore.jks