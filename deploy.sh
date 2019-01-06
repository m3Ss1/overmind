#!/bin/bash
echo "Stopping running node instance"
forever stop server.js

echo "Fetching GIT repository"
git fetch --all

echo "Reset local to origin/master status"
git reset --hard origin/master

echo "Starting node..."
forever start server.js
