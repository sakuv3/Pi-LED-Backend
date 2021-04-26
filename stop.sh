#!/bin/bash

# holds the Process IDs 
declare -a PIDFILE=("/tmp/LED.pid" "/tmp/NODE.pid")

# taken from pihole installer script
RED='\e[0;31m'
GREEN='\e[0;32m'
NC='\e[0m'
TICK="[${GREEN}✓${NC}]"
CROSS="[${RED}✗${NC}]"

for file in "${PIDFILE[@]}"
do
    # see if PID files exist
    if [ ! -e "$file" ]; then
        echo "process not running"
        continue
    fi
    PID=$(< "$file")
    # see if process is running and save the name
    name=$(ps -q "$PID" -o args= | awk "{print $2}")
    name=$(basename "$name")
    if [ -n "$name" ]
    then
        echo -n "[i] $PID stopping $name..."
        kill -s SIGINT $PID
        # see if process has been killed
        sleep 1
        process=$(ps -q $PID -o comm=)
        if [ -z "$process" ]
        then
            echo -e "\r$TICK $PID stopped $name"
        else
            echo -e "\r$CROSS $PID could not stop process $name"
        fi
    else
        echo -e "$CROSS $PID process not running"
    fi
    rm $file
done
