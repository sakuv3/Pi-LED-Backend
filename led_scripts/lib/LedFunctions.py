#!/usr/bin/python3
#coding=utf-8

import Adafruit_WS2801
import Adafruit_GPIO.SPI as SPI
import multiprocessing
import queue
import time

import lib.Logger

SPI_PORT = 0
SPI_DEVICE = 0
PIXEL_COUNT = 153
PIXEL = Adafruit_WS2801.WS2801Pixels(PIXEL_COUNT, spi=SPI.SpiDev(SPI_PORT, SPI_DEVICE))

logger = lib.Logger.getLogger(__name__)


def setColor(color: str):
    # hex to rgb
    #(R, G, B) = tuple(int(color[i:i+2], 16) for i in (0, 2, 4))
    PIXEL.set_pixels(int(color, 16))
    PIXEL.show()
    logger.debug("pixel set")

def wheel(pos: int):
    if pos < 85:
        return Adafruit_WS2801.RGB_to_color(pos * 3, 255 - pos * 3, 0)
    elif pos < 170:
        pos -= 85
        return Adafruit_WS2801.RGB_to_color(255 - pos * 3, 0, pos * 3)
    else:
        pos -= 170
        return Adafruit_WS2801.RGB_to_color(0, pos * 3, 255 - pos * 3)


def rainbow(rainbow_queue: multiprocessing.Queue):
    logger.debug("rainbow started")
    SLEEPTIME = 0.05
    while True:
        for j in range(256):  # one cycle of all 256 colors in the wheel
            for i in range(PIXEL.count()):
                PIXEL.set_pixel(i, wheel(((i * 256 // PIXEL_COUNT) + j) % 256))
            PIXEL.show()
            # get current sleeptime
            try:
                # clear the queue since the script is not fast enough to react to quick changes in speed
                while not rainbow_queue.empty():
                    SLEEPTIME = rainbow_queue.get(block=False)
                    logger.debug(f"new sleeptime: {SLEEPTIME}")
            except queue.Empty:
                logger.debug("queue is empty")
                pass
            time.sleep(SLEEPTIME)

