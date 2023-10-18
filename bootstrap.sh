openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048

openssl rsa -pubout -in private_key.pem -out public_key.pem

base64 -i private_key.pem -o private_key-base64.txt

base64 -i public_key.pem -o public_key-base64.txt