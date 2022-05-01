#!/bin/bash
if [ -z "$1" ]
then
    echo "No image version specified! Example: bash build.sh 1.0.0"
else
    sudo docker build -t vbee-asr-gateway:$1 .
    sudo docker tag vbee-asr-gateway:$1 775774526124.dkr.ecr.ap-southeast-1.amazonaws.com/vbee-asr-gateway:$1
    sudo docker push 775774526124.dkr.ecr.ap-southeast-1.amazonaws.com/vbee-asr-gateway:$1
fi