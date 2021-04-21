import time
import Adafruit_WS2801
import Adafruit_GPIO.SPI as SPI
PIXEL_COUNT = 153
SPI_PORT = 0
SPI_DEVICE = 0
# RBG


def leuchte(pixels, delay=0.0001):
    for x in range(PIXEL_COUNT):
        pixels.set_pixel_rgb(x, 255, 0, 50)
        time.sleep(delay)
    pixels.show()


def clear(pixels):
    pixels.clear()
    pixels.show()


def main():
    pixels = Adafruit_WS2801.WS2801Pixels(PIXEL_COUNT, spi=SPI.SpiDev(SPI_PORT, SPI_DEVICE))
    clear(pixels)
    leuchte(pixels)
    print('ENDE')


if __name__ == "__main__":
    main()

