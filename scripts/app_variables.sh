#!/bin/true
#
# This is not an executable script, just a set of names and variable declarations.
#
# Use it with:
#   source aws_codedeploy_variables.sh
# Or:
#   . aws_codedeploy_variables.sh

# The deployed package name (e.g package.json package name)
PKG_NAME="single_machine"

# The base directory to which package will be installed
PKG_DIR="/var/www/single_machine"

# Mapping from AWS CodeDeploy Deployment Groups to 'environments' (e.g development, staging, production).
# This can be used e.g to set NODE_ENV.
declare -A DEPLOYMENT_GROUP_ENV
DEPLOYMENT_GROUP_ENV=(["development"]="development" ["production"]="production")

# The named processes to be started/stopped/validated as part of deployment (e.g supervisord program names)
declare -A PROCESSES
PROCESSES=( ["single_machine"]="server.js")