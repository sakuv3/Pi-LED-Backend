#!/usr/bin/python3
#coding=utf-8

import multiprocessing
import signal
import socket
import time

import lib.LedFunctions as LED
import lib.Message as MSG

# signal handler for INTERRUPT
def handler(signum, frame):
    print("script is stopping")
    sock.close()
    LED.setColor("0")
    print("script stopped")
    exit()
signal.signal(signal.SIGINT, handler)


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

while True:
    print("socket is listening on 55555")
    # accept a new client (the backend server)
    (client, address) = sock.accept()
    print("client from {} connected".format(address))
    connected = True
    while connected:
        # get data from client
        data = MSG.getMsg(client)
        if not data:
            connected = False
            client.close()
            print("client disconnected")
            continue

        if data["type"] == "colorwheel":
            # if rainbow runs, we need to kill it
            try:
                if rainbow.is_alive():
                    print("stopping rainbow...")
                    rainbow.terminate()
            except NameError:
                pass
            color = data["args"]
            LED.setColor(color)
        elif data["type"] == "rainbow":
            # if rainbow runs, no need to stop it
            try:
                if rainbow.is_alive():
                    continue    
            except NameError:
                pass
            # run rainbow in seperate process
            rainbow = multiprocessing.Process(target=LED.rainbow, args=(), daemon=True)
            rainbow.start()
