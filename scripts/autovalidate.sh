#!/bin/bash
#
# Validate a PM2-managed service is up and running.
#
################################################################################

set -e

# Deploy hooks are run via absolute path, so taking dirname of this script will give us the path to
# our deploy_hooks directory.
. "$(dirname "$0")"/app_variables.sh

for proc in "${PROCESSES[@]}"; do
    while true; do
        status="$(pm2 status "$proc")"
        case "$status" in
            *online*)
                exit 0
                ;;
            *)
                exit 1
                ;;
        esac
    done
done