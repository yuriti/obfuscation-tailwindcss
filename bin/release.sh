#!/bin/bash

cd "${0%/*}"
cd ..

# .env variables
set -o allexport; source .env; set +o allexport

GITHUB_TOKEN=$GITHUB_TOKEN release-it