#!/bin/bash

# holds the Process IDs 
declare -a PIDFILE=("/tmp/LED.pid" "/tmp/NODE.pid")

# taken from pihole installer script
RED='\e[0;31m'
GREEN='\e[0;32m'
NC='\e[0m'
TICK="[${GREEN}✓${NC}]"
CROSS="[${RED}✗${NC}]"

# create log folder and log files if not present
file=$(realpath $0)
root=$(dirname $file)
mkdir -p $root/log/
>> $root/log/led.log
>> $root/log/node.log

# see if led server PID exists
if [ -e "${PIDFILE[0]}" ]; then
    echo -e "$CROSS led server already running or previous dirty shutdown"
    echo "if server not running, remove file '${PIDFILE[0]}' and try again"
else
    # start led server
    echo -n "[i] Starting led server..."
    nohup python3 $root/led_scripts/led.py &> /dev/null &
    PID_LED=$! 
    echo $PID_LED >> "${PIDFILE[0]}"
    sleep 1
    echo -e "\r$TICK $PID_LED led server running"
fi

# see if node server PID exists
if [ -e "${PIDFILE[1]}" ]; then
    echo -e "$CROSS node server already running or previous dirty shutdown"
    echo "if server not running, remove file '${PIDFILE[1]}' and try again"
else
    #s start node server
    echo -n "[i] Starting node server..."
    nohup node $root/server.js &>> $root/log/node.log &
    PID_NODE=$!
    echo $PID_NODE >> "${PIDFILE[1]}"
    sleep 1
    echo -e "\r$TICK $PID_NODE node server running"
fi
