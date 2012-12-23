#!/bin/bash

PDF=$1
EXTRACT_FIELDS=$2
PORT=11111
HOST=$3

if [ -z "$HOST" ]; then
	HOST="localhost"
fi

curl http://$HOST:$PORT -T $1 -H "x-extract-fields: $EXTRACT_FIELDS"