# Rainbow
import time
import Adafruit_WS2801
import Adafruit_GPIO.SPI as SPI
PIXEL_COUNT = 165
SPI_PORT = 0
SPI_DEVICE = 0


def disco(pixels, delay=0.001):
    for i in range(5):
        rainbow_cycle(pixels)
# Define the wheel function to interpolate between different hues.


def wheel(pos):
    if pos < 85:
        return Adafruit_WS2801.RGB_to_color(pos * 3, 255 - pos * 3, 0)
    elif pos < 170:
        pos -= 85
        return Adafruit_WS2801.RGB_to_color(255 - pos * 3, 0, pos * 3)
    else:
        pos -= 170
        return Adafruit_WS2801.RGB_to_color(0, pos * 3, 255 - pos * 3)
# Define rainbow cycle function to do a cycle of all hues.


def rainbow_cycle(pixels, wait=0.1):
    for j in range(256):  # one cycle of all 256 colors in the wheel
        for i in range(pixels.count()):
            pixels.set_pixel(i, wheel(((i * 256 // pixels.count()) + j) % 256))
        pixels.show()
        if wait > 0:
            time.sleep(wait)


def brightness_decrease(pixels, wait=0.01, step=1):
    for j in range(int(256 // step)):
        for i in range(pixels.count()):
            r, g, b = pixels.get_pixel_rgb(i)
            r = int(max(0, r - step))
            g = int(max(0, g - step))
            b = int(max(0, b - step))
            pixels.set_pixel(i, Adafruit_WS2801.RGB_to_color(r, g, b))
        pixels.show()
        if wait > 0:
            time.sleep(wait)


def off(pixels):
    for i in range(pixels.count()):
        pixels.set_pixel_rgb(i, 0, 0, 0)
    pixels.show()


def clear(pixels):
    pixels.clear()
    pixels.show()


def main():
    pixels = Adafruit_WS2801.WS2801Pixels(PIXEL_COUNT, spi=SPI.SpiDev(SPI_PORT, SPI_DEVICE))
    clear(pixels)
    while True:
      disco(pixels)
    brightness_decrease(pixels)
    off(pixels)
    print('ENDE')


if __name__ == "__main__":
    main()

