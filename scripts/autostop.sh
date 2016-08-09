#!/bin/bash
#
# Stop a Node.js application managed by PM2
#
################################################################################

# XXX We do not 'set -e' here because 'pm2 delete' will error if the application process is not currently running,
# which could happen under certain circumstances (initial environment deploys, recovering from previous errors.)

# Deploy hooks are run via absolute path, so taking dirname of this script will give us the path to
# our deploy_hooks directory.
. "$(dirname "$0")"/app_variables.sh

pushd "$PKG_DIR" >/dev/null

for proc in "${PROCESSES[@]}"; do
    pm2 delete "$proc"
done

popd >/dev/null