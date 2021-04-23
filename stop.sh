#!/bin/bash

pidfile_led=/tmp/led.pid
pidfile_node=/tmp/node.pid

# see if PID files exist
if [ ! -e "$pidfile_led" ]; then
    echo "led server not running"
    exit 0
fi

if [ ! -e "$pidfile_node" ]; then
    echo "node server not running"
    exit 0
fi

PID_LED=$(<$pidfile_led)
PID_NODE=$(<$pidfile_node)

#see if led process runs
if ps -p $PID_LED > /dev/null  
then
    kill  $PID_LED
    if ! ps -p $PID_LED > /dev/null
    then
        echo "led server  $PID_LED stopped"
    else
        echo "could not stop led server $PID_LED"
    fi
else
    echo "led server $PID_LED not running"
fi

# see if node process runs
if ps -p $PID_NODE > /dev/null
then
    kill  $PID_NODE
    if ! ps -p $PID_NODE > /dev/null
    then
        echo "node server $PID_NODE stopped"
    else
        echo "could not stop node server $PID_NODE"
    fi
else
    echo "node server $PID_NODE not running"
fi

rm $pidfile_led
rm $pidfile_node

sleep 3
reset

