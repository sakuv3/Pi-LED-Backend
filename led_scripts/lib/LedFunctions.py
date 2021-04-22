import time
import Adafruit_WS2801
import Adafruit_GPIO.SPI as SPI
PIXEL_COUNT = 153
SPI_PORT = 0
SPI_DEVICE = 0
PIXEL = Adafruit_WS2801.WS2801Pixels(PIXEL_COUNT, spi=SPI.SpiDev(SPI_PORT, SPI_DEVICE))


def setColor(color: tuple):
    for n in range(PIXEL_COUNT):
        PIXEL.set_pixel_rgb(n, color)


def clear(pixels):
    pixels.clear()
    pixels.show()


def dimm():
    clear(pixels)
    leuchte(pixels)
    print('ENDE')