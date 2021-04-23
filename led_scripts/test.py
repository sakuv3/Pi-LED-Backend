#!/usr/bin/python3
#coding=utf-8

import multiprocessing
import queue
import socket
import time

import lib.LedFunctions as LED
import lib.Message as MSG


# socket setup
TIMEOUT = 10
sock = socket.socket()
while True:
    try:
        print("Trying to bind socket")
        sock.bind(("", 55555))
        break
    except socket.error:
        print("Could not bind socket, waiting {} seconds before retrying...".format(TIMEOUT))
        time.sleep(TIMEOUT)
sock.listen(0)
print("socket is listening")

while True:
    (client, address) = sock.accept()
    print("client from {} connected".format(address))
    connected = True
    while connected:
        data = MSG.getMsg(client)
        if not data:
            connected = False
            client.close()
            print("client disconnected")
            continue

        if data["type"] == "colorwheel":
            try:
                if rainbow.is_alive():
                    print("stopping rainbow...")
                    rainbow.terminate()
            except NameError:
                print("rainbow not running")
            color = data["args"]
            LED.setColor(color)
        elif data["type"] == "rainbow":
            try:
                if rainbow.is_alive():
                    continue    
            except NameError:
                print("rainbow not running")

            rainbow = multiprocessing.Process(target=LED.rainbow, args=(), daemon=True)
            rainbow.start()

        
    
    

client.close()
sock.close()
exit()