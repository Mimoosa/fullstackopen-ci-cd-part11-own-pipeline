#!/bin/bash

echo "Build script"

# add the commands here
npm install
npm --prefix frontend install
npm run build:frontend
