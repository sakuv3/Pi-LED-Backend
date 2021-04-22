#!/usr/bin/python3
#coding=utf-8

import json
import socket

sock = socket.socket()
sock.bind(("", 55555))
sock.listen()
print("socket is listening")
(client, address) = sock.accept()
print(f"client from {address} connected")

while True:
    data = json.loads(client.recv(50).decode("utf-8"))
    print(data["type"], data["args"])
    
    

client.close()
sock.close()
exit()