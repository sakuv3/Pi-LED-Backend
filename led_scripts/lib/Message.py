#!/usr/bin/python3
#coding=utf-8

import json
import socket

HEADER_LENGTH = 5


def getMsg(client: socket) :
    try:
        # Receive our "header" containing message length, it's size is defined and constant
        data_len = client.recv(HEADER_LENGTH)
        # If we received no data, client gracefully closed a connection, for example using socket.close() or socket.shutdown(socket.SHUT_RDWR)
        if not len(data_len):
            return False
        #print(head)
        # Receive data
        data = client.recv(int(data_len)).decode("utf-8")
        data = json.loads(data)
        print(data)
        # return a dict
        return data
    except socket.error:
        # If we are here, client closed connection violently, for example by pressing ctrl+c on his script
        # or just lost his connection
        # socket.close() also invokes socket.shutdown(socket.SHUT_RDWR) what sends information about closing the socket (shutdown read/write)
        # and that's also a cause when we receive an empty message
        return False