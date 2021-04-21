import sys
sleeptime = 0.1

if __name__ == "__main__":
    if len(sys.argv) > 1:
        sleeptime = sys.argv[1]
    print(sleeptime)
