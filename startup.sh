#!/bin/sh
touch /data/overmind/touched
forever start --minUptime 1000 --spinSleepTime 1000 /data/overmind/server.js
