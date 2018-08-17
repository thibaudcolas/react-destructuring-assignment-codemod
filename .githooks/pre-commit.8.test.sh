#!/usr/bin/env bash

set -e

if [ -n "$JS_STAGED" ];
then
  npm run test
fi
