#!/bin/bash

PORT=11111
PDF=$1
EXTRACT_FIELDS=$2

curl http://localhost:$PORT -T $1 -H "x-extract-fields: $EXTRACT_FIELDS"