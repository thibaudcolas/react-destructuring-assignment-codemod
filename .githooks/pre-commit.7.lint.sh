#!/usr/bin/env bash

if [ -n "$JS_STAGED" ];
then
    npx prettier --list-different $JS_STAGED
fi

if [ -n "$SCSS_STAGED" ];
then
    npx prettier --list-different $SCSS_STAGED
fi

if [ -n "$MD_STAGED" ];
then
    npx prettier --list-different $MD_STAGED
fi

if [ -n "$JSON_STAGED" ];
then
    npx prettier --list-different $JSON_STAGED
fi

if [ -n "$YAML_STAGED" ];
then
    npx prettier --list-different $YAML_STAGED
fi
