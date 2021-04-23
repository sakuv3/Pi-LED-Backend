#!/usr/bin/python3
#coding=utf-8

import socket
import threading
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
rainbow_event = threading.Event()
rainbow_thread = threading.Thread(target=LED.rainbow, args=(rainbow_event,), daemon=True)
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
            if rainbow_thread.is_alive():
                rainbow_event.set()
                print("stopping rainbow...")
                rainbow_thread.join()
                rainbow_event.clear()
            color = data["args"]
            LED.setColor(color)
        elif data["type"] == "rainbow":
            if rainbow_thread.is_alive():
                continue
            rainbow_thread = threading.Thread(target=LED.rainbow, args=(rainbow_event,), daemon=True)
            rainbow_thread.start()

        
    
    

client.close()
sock.close()
exit()