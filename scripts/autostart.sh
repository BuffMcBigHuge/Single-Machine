#!/bin/bash
#
# Start a Node.js application managed by PM2
#
################################################################################

set -e

# Deploy hooks are run via absolute path, so taking dirname of this script will give us the path to
# our deploy_hooks directory.
. "$(dirname "$0")"/app_variables.sh

pushd "$PKG_DIR" >/dev/null

NODE_ENV="${DEPLOYMENT_GROUP_ENV["$DEPLOYMENT_GROUP_NAME"]}"

# NOTE: PROCESSES Should be an associative array mapping application name
# to executable path relative to package install dir (PKG_DIR)
for proc in "${!PROCESSES[@]}"; do
    NODE_ENV="$NODE_ENV" pm2 start "${PROCESSES["$proc"]}" --name "$proc"

done
popd >/dev/null
