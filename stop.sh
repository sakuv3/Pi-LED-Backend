#!/bin/bash

PID_1=$(cat led.pid)
echo $PID_1
kill -INT $PID_1
rm led.pid