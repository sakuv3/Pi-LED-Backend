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
sock.listen()

# process object
rainbow = False

# connection loop
while True:
    print("socket is listening on 55555")
    # accept a new client (the node server)
    (client, address) = sock.accept()
    print("client from {} connected".format(address))

    # message loop
    while True:
        # get data from client
        data = MSG.getMsg(client)
        if not data:
            client.close()
            print("client disconnected")
            break

        # parse data
        if data["type"] == "colorwheel":
            # if rainbow runs, we need to terminate it
            if rainbow and rainbow.is_alive():
                print("stopping rainbow...")
                rainbow.terminate()

            # set the LED
            color = data["args"]
            LED.setColor(color)
        
        elif data["type"] == "rainbow":
            # if rainbow runs, no need to stop it
            if rainbow and rainbow.is_alive():
                continue    

            #create a new process object and run it
            else:
                rainbow = multiprocessing.Process(target=LED.rainbow, args=(), daemon=True)
                rainbow.start()
