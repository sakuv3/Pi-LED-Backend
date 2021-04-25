#!/bin/bash

pidfile_led=/tmp/led.pid
pidfile_node=/tmp/node.pid

file=$(realpath $0)
root=$(dirname $file)


mkdir -p $root/log/
> $root/log/led.log
> $root/log/node.log

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
nohup python3 $root/led_scripts/led.py &> /dev/null &
PID_LED=$! 
echo $PID_LED > $pidfile_led
echo "led server started:  $PID_LED"

#s start node server
nohup node $root/server.js &>> $root/log/node.log &
PID_NODE=$!
echo $PID_NODE > $pidfile_node
echo "node server started: $PID_NODE"