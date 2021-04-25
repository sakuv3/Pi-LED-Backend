#!/bin/bash

# holds the Process IDs 
PIDFILE=/tmp/LED.pid


# taken from pihole installer script
RED='\e[0;31m'
GREEN='\e[0;32m'
NC='\e[0m'
TICK="[${GREEN}✓${NC}]"
CROSS="[${RED}✗${NC}]"


# see if PID files exist
if [ ! -e "$PIDFILE" ]; then
    echo "server not running"
    exit 0
fi


while read PID
do
    # see if process is running
    name=$(ps -q $PID -o comm=)
    if [ -n "$name" ]
    then
        kill -s SIGINT $PID
        # see if process has been killed
        sleep 0.05
        process=$(ps -q $PID -o comm=)
        if [ -z "$process" ]
        then
            echo -e "$TICK stopped process $name $PID"
        else
            echo -e "$CROSS could not stop process $name $PID"
        fi
    else
        echo -e "$CROSS process $PID not running"
    fi
done < $PIDFILE


rm $PIDFILE
