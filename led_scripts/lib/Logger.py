#!/usr/bin/python3
#coding=utf-8

import logging
import os


filename = "led.log"
LOG_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../log"))
LOG_FILE = os.path.abspath(os.path.join(LOG_PATH, filename))


# create Handler
f_handler = logging.FileHandler(LOG_FILE)
f_handler.setLevel(logging.DEBUG)

# create formatter and add it to handler
# for LogRecord attributes see https://docs.python.org/3/library/logging.html#logrecord-attributes
# for date format see https://strftime.org/
f_formatter = logging.Formatter(fmt="%(levelname)-7s %(asctime)s  %(name)-20s: in: %(funcName)-20s L:%(lineno)-4s:: %(msg)s", datefmt="%x %X")
f_handler.setFormatter(f_formatter)


def getLogger(logger_name):
    # create logger
    logger = logging.getLogger(logger_name)
    logger.setLevel(logging.DEBUG)
    # add handler to logger
    logger.addHandler(f_handler)
    logger.propagate = False
    return logger
        