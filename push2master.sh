#!/bin/bash

git checkout master && git pull origin dev && git push origin master && git checkout dev

if [ $? -eq 0 ]; then
  echo "Successfully pushed to master."
else
  echo "Failed to push to master."
fi
