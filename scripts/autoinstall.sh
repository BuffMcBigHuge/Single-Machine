#!/bin/bash
#
# Install package dependencies for a Node.js package
#
################################################################################

set -e

# Deploy hooks are run via absolute path, so taking dirname of this script will give us the path to
# our deploy_hooks directory.
. "$(dirname "$0")"/app_variables.sh

pushd "$PKG_DIR" >/dev/null

npm install

# Run bower
if [ -f "tools/bower.json" ];
then
    bower --allow-root install
fi

# Run gulp
if [ -f "tools/gulpfile.js" ];
then
    gulp
fi

popd >/dev/null