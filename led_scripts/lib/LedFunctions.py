#!/usr/bin/python3
#coding=utf-8

import time
import Adafruit_WS2801
import Adafruit_GPIO.SPI as SPI
import threading

SPI_PORT = 0
SPI_DEVICE = 0
SLEEPTIME = 0.05
PIXEL_COUNT = 153
PIXEL = Adafruit_WS2801.WS2801Pixels(PIXEL_COUNT, spi=SPI.SpiDev(SPI_PORT, SPI_DEVICE))


def setColor(color):
    (R, G, B) = tuple(int(color[i:i+2], 16) for i in (0, 2, 4))
    PIXEL.clear()
    for n in range(PIXEL_COUNT):
        PIXEL.set_pixel_rgb(n, R, G, B)
    PIXEL.show()
    print("pixel set")

def wheel(pos):
    if pos < 85:
        return Adafruit_WS2801.RGB_to_color(pos * 3, 255 - pos * 3, 0)
    elif pos < 170:
        pos -= 85
        return Adafruit_WS2801.RGB_to_color(255 - pos * 3, 0, pos * 3)
    else:
        pos -= 170
        return Adafruit_WS2801.RGB_to_color(0, pos * 3, 255 - pos * 3)


def rainbow_cycle():
    for j in range(256):  # one cycle of all 256 colors in the wheel
        for i in range(PIXEL.count()):
            PIXEL.set_pixel(i, wheel(((i * 256 // PIXEL_COUNT) + j) % 256))
        PIXEL.show()
        time.sleep(SLEEPTIME)

def rainbow(event):
    print("rainbow started")
    while True:
        if event.is_set():
            print("rainbow stopped")
            return
        rainbow_cycle()