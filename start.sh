#!/bin/bash

# holds the Process IDs 
PIDFILE=/tmp/LED.pid


# taken from pihole installer script
RED='\e[0;31m'
GREEN='\e[0;32m'
NC='\e[0m'
TICK="[${GREEN}✓${NC}]"
CROSS="[${RED}✗${NC}]"


# create folder and logfiles if not present
file=$(realpath $0)
root=$(dirname $file)
mkdir -p $root/log/
>> $root/log/led.log
>> $root/log/node.log


# see if PID exists
if [ -e "$PIDFILE" ]; then
    echo -e "$CROSS Server already running or previous dirty shutdown"
    echo "if server not running, remove file '$PIDFILE' and try again"
    exit 1
fi


# start led server
echo -n "[i] Starting led server..."
nohup python3 $root/led_scripts/led.py &> /dev/null &
PID_LED=$! 
echo $PID_LED >> $PIDFILE
sleep 1
echo -e "\r$TICK $PID_LED led server running"


#s start node server
echo -n "[i] Starting node server..."
nohup node $root/server.js &>> $root/log/node.log &
PID_NODE=$!
echo $PID_NODE >> $PIDFILE
sleep 1
echo -e "\r$TICK $PID_NODE node server running"
