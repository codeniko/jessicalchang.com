#!/bin/bash

git checkout master && git pull origin dev && git push origin master && git checkout dev

if [ $? -eq 0 ]; then
  echo "Successfully pushed to prod."
else
  echo "Failed to push to prod."
fi
