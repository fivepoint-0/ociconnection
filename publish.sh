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
    sed -i "/\"patch\":/ s/\"patch\":[^,]*/\"patch\": $NEW_PATCH_VERSION/" version.json > /dev/null
    ;;
  "minor")
    echo "Publishing a new MINOR version."
    echo "New MINOR version: $NEW_MINOR_VERSION"
    NEW_VERSION="$CURRENT_MAJOR_VERSION.$NEW_MINOR_VERSION.0"
    sed -i "/\"minor\":/ s/\"minor\":[^,]*/\"minor\": $NEW_MINOR_VERSION/" version.json > /dev/null
    sed -i "/\"patch\":/ s/\"patch\":[^,]*/\"patch\": 0/" version.json > /dev/null
    ;;
  "major")
    echo "Publishing a new MAJOR version."
    echo "New MAJOR version: $NEW_MAJOR_VERSION"
    NEW_VERSION="$NEW_MAJOR_VERSION.0.0"
    sed -i "/\"major\":/ s/\"major\": ?\d*/\"major\": $NEW_MAJOR_VERSION/" version.json > /dev/null
    sed -i "/\"minor\":/ s/\"minor\":[^,]*/\"minor\": 0/" version.json > /dev/null
    sed -i "/\"patch\":/ s/\"patch\":[^,]*/\"patch\": 0/" version.json > /dev/null
    ;;
  *)
    exit
    ;;
esac

sed -i "/\"version\":/ s/\"version\":[^,]*/\"version\": \"$NEW_VERSION\"/" package.json > /dev/null
sed -i "5i ### $NEW_VERSION: $COMMIT_MSG \n" README.MD > /dev/null

npm publish
git add -A
git commit -m "$NEW_VERSION: $COMMIT_MSG"
git push