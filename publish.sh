#!/usr/bin/bash

UPDATE_LEVEL=$1
shift 1
COMMIT_MSG="$*"

CURRENT_MAJOR_VERSION=$(cat version.json | jq '.["major"]')
let NEW_MAJOR_VERSION=$CURRENT_MAJOR_VERSION+1

CURRENT_MINOR_VERSION=$(cat version.json | jq '.["minor"]')
let NEW_MINOR_VERSION=$CURRENT_MINOR_VERSION+1

CURRENT_PATCH_VERSION=$(cat version.json | jq '.["patch"]')
let NEW_PATCH_VERSION=$CURRENT_PATCH_VERSION+1

CURRENT_VERSION="$CURRENT_MAJOR_VERSION.$CURRENT_MINOR_VERSION.$CURRENT_PATCH_VERSION"

echo "Current version is: $CURRENT_VERSION"

NEW_VERSION=""

case "$UPDATE_LEVEL" in
  "patch")
    echo "Publishing a new PATCH version."
    echo "New PATCH version: $NEW_PATCH_VERSION"
    NEW_VERSION="$CURRENT_MAJOR_VERSION.$CURRENT_MINOR_VERSION.$NEW_PATCH_VERSION"  
    ;;
  "minor")
    echo "Publishing a new MINOR version."
    echo "New MINOR version: $NEW_MINOR_VERSION"
    NEW_VERSION="$CURRENT_MAJOR_VERSION.$NEW_MINOR_VERSION.$CURRENT_PATCH_VERSION"  
    ;;
  "major")
    echo "Publishing a new MAJOR version."
    echo "New MAJOR version: $NEW_MAJOR_VERSION"
    NEW_VERSION="$NEW_MAJOR_VERSION.$CURRENT_MINOR_VERSION.$CURRENT_PATCH_VERSION"  
    ;;
  *)
    exit
    ;;
esac

cat package.json | sed -i "/\"version\":/ s/\"version\":[^,]*/\"version\": \"$NEW_VERSION\"/" > /dev/null

sed -i "5i ### $NEW_VERSION: $COMMIT_MSG \n" README.MD > /dev/null

npm publish
git add -A
git commit -m "$NEW_VERSION: $COMMIT_MSG"
git push