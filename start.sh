#!/bin/bash

pidfile_led=/tmp/led.pid
pidfile_node=/tmp/node.pid

# see if led PID exists
if [ -e "$pidfile_led" ]; then
    echo "warning: led server already running or previous dirty shutdown"
    echo "remove file '$pidfile_led' and try again"
    exit 1
fi

#see if node PID exists
if [ -e "$pidfile_node" ]; then
    echo "warning: node server already running or previous dirty shutdown"
    echo "remove file '$pidfile_node' and try again"
    exit 1
fi

# start led server
/usr/bin/python3 /home/joni/backend/led_scripts/led.py &#>> /home/joni/backend/log/led.log &
PID_LED=$! 
echo $PID_LED > $pidfile_led
echo "led server started:  $PID_LED"

#s start node server
/usr/bin/node /home/joni/backend/server.js &#>> /home/joni/backend/log/node.log &
PID_NODE=$!
echo $PID_NODE > $pidfile_node
echo "node server started: $PID_NODE"