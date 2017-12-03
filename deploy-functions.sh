#!/bin/bash
firebase deploy --only functions

# to configure environmental variables
# firebase functions:config:set smtp.server='smtp.gmail.com' smtp.port=587 smtp.tls=true smtp.user='' smtp.pass='' smtp.to=''
