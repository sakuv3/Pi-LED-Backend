#!/usr/bin/python3
#coding=utf-8

import multiprocessing
import signal
import socket
import time

import lib.LedFunctions as LED
import lib.Logger as Logger
import lib.Message as MSG

logger = Logger.getLogger(__name__)

# signal handler for SIGINT
def exitHandler(signum, frame):
    logger.debug(f"received SIGNAL {signum}, stopping script")
    LED.setColor("0")
    logger.debug("script stopped")
    exit()
signal.signal(signal.SIGINT, exitHandler)


# socket setup
TIMEOUT = 10
sock = socket.socket()
while True:
    try:
        logger.debug("Trying to bind socket")
        sock.bind(("127.0.0.1", 55555))
        break
    except socket.error:
        logger.debug("Could not bind socket, waiting {} seconds before retrying...".format(TIMEOUT))
        time.sleep(TIMEOUT)
sock.listen()

# process object
rainbow = False

# connection loop
while True:
    logger.debug("socket is listening on 55555")
    # accept a new client (the node server)
    (client, address) = sock.accept()
    logger.debug(f"client from {address} connected")

    # message loop
    while True:
        # get data from client
        data = MSG.getMsg(client)
        if not data:
            client.close()
            logger.debug("client disconnected")
            break

        # parse data
        if data["type"] == "colorwheel":
            # if rainbow runs, we need to terminate it
            if rainbow and rainbow.is_alive():
                logger.debug("stopping rainbow...")
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
