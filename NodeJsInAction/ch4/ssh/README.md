1.生成一个名为key.pem的私钥文件： openssl genrsa 1024 > key.pem
2.生成名为key-cert.pem的证书：openssl req -x509 -new -key key.pem > key-cert.pem