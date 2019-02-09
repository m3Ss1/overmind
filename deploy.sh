#!/bin/bash
forever stopall
git fetch --all --quiet
git reset --hard origin/master
forever start --minUptime 1000 --spinSleepTime 1000 server.js
