#!/usr/bin/env bash

BIN="$HOME/.local/bin"

curl https://keybase.io/codecovsecurity/pgp_keys.asc | gpg --no-default-keyring --keyring trustedkeys.gpg --import

curl -O https://uploader.codecov.io/latest/linux/codecov
curl -O https://uploader.codecov.io/latest/linux/codecov.SHA256SUM
curl -O https://uploader.codecov.io/latest/linux/codecov.SHA256SUM.sig

echo "Running an integrity check"
gpgv codecov.SHA256SUM.sig codecov.SHA256SUM
shasum -a 256 -c codecov.SHA256SUM

echo "Installing codecov into $BIN"
chmod +x codecov
mkdir -p "$BIN"
mv codecov "$BIN/codecov"
