# Rainbow
import sys
import time
import signal
import Adafruit_WS2801
import Adafruit_GPIO.SPI as SPI

SPI_PORT = 0
SPI_DEVICE = 0
PIXEL_COUNT = 165
sleeptime = 0.05


def signal_handler(sig, frame):
  print("sigint ctrl+c")

def wheel(pos):
    if pos < 85:
        return Adafruit_WS2801.RGB_to_color(pos * 3, 255 - pos * 3, 0)
    elif pos < 170:
        pos -= 85
        return Adafruit_WS2801.RGB_to_color(255 - pos * 3, 0, pos * 3)
    else:
        pos -= 170
        return Adafruit_WS2801.RGB_to_color(0, pos * 3, 255 - pos * 3)


def rainbow_cycle(pixels):
    for j in range(256):  # one cycle of all 256 colors in the wheel
        for i in range(pixels.count()):
            pixels.set_pixel(i, wheel(((i * 256 // pixels.count()) + j) % 256))
        pixels.show()
        time.sleep(sleeptime)


def main():
    pixels = Adafruit_WS2801.WS2801Pixels(PIXEL_COUNT, spi=SPI.SpiDev(SPI_PORT, SPI_DEVICE))
    pixels.clear()
    pixels.show()
    while True:
      rainbow_cycle(pixels)


if __name__ == "__main__":
    if len(sys.argv) > 1:
            sleeptime = float(sys.argv[1])
    print("sleeptime: %.10f"%sleeptime)
    signal.signal(signal.SIGINT, signal_handler)
    main()

