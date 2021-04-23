#!/bin/bash

/usr/bin/python3 /home/joni/backend/led_scripts/led.py &
echo $! >> led.pid
/usr/bin/node /home/joni/backend/server.js &
echo $! >> led.pid