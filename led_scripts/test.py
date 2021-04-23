#!/usr/bin/python3
#coding=utf-8

import queue
import socket
import threading
import time

import lib.LedFunctions as LED
import lib.Message as MSG

rainbowQueue = queue.Queue()

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
                if rainbow_thread.is_alive():
                    rainbowQueue.put("stop")
                    print("stopping rainbow...")
                    rainbow_thread.join()
            except NameError:
                print("rainbow thread not running")
            color = data["args"]
            LED.setColor(color)
        elif data["type"] == "rainbow":
            try:
                if rainbow_thread.is_alive():
                    continue    
            except NameError:
                print("rainbow thread not running")

            rainbow_thread = threading.Thread(target=LED.rainbow, args=(rainbowQueue,), daemon=True)
            rainbow_thread.start()

        
    
    

client.close()
sock.close()
exit()