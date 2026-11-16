# Utility scripts

A collection of bash scripts to run utilities.

TODO: chapter for each script

## Cypress tests

Run required proxy services. Supports `podman`.

```bash
./scripts/run-test-proxies.sh [--builder BUILDER; default="docker"]
```

Stop proxies

```bash
./scripts/stop-test-proxies.sh [BUILDER; default="docker"]
```

## Dependency cruiser

A visual graph of module import resolution can help with debugging, especially in a large monorepo. The following script will output a `dot` file that can be rendered to svg (with GraphViz) and then to `html` to be opened in any browser.

```bash
# replace firefox with a browser of your choice
yarn cruise -p apps/services/sessions && firefox depgraph.html
```

This uses [dependency-cruiser](https://www.npmjs.com/package/dependency-cruiser) behind the scenes. Feel free to add `.dependency-cruiser.local.js` in the repo root to merge your custom config with the default.

## HMR benchmark

The following command can be used to benchmark the startup and hot-reload time of any NX `serve` targets. The default message is the service ready output for NestJS services.

Run `yarn hmr-benchmark --help` for available options

```bash
yarn hmr-benchmark --app <service name> --message <the output message to watch> --logfile [default: workspace root]
```

Example:

```bash
yarn hmr-benchmark --app services-sessions --message 'Nest application successfully started'
```

## Scrub before sharing

Masks personal data and secrets in text or raw data, such as that from Datadog, GraphQL responses, the browser console or database queries, before it is shared.

Each value gets a consistent label (`[KT-PERSON-1]`, `[NAME-1]`), so people can still be told apart. The script is an aid, not a guarantee: read the output before sharing it.

To scrub the clipboard:

```bash
pbpaste | node scripts/scrub.mjs | pbcopy
```

To scrub a file, ask for extra names to mask and list what was masked:

```bash
node scripts/scrub.mjs --names --show application.json > scrubbed.json
```

`--help` explains the options and lists what is masked.

To run it as `scrub` from anywhere, add this to `~/.zshrc` or `~/.bashrc`, with the path to your copy of the repo. It reads a file, piped input or the clipboard, and puts the result on the clipboard:

```bash
scrub() { if [ -t 0 ]; then pbpaste; else cat; fi | node ~/git/island.is/scripts/scrub.mjs "$@" | pbcopy; }
```

On other systems, replace `pbpaste` and `pbcopy` with:

- Linux (Wayland): `wl-paste` and `wl-copy`, from the `wl-clipboard` package.
- Linux (X11): `xclip -selection clipboard -o` and `xclip -selection clipboard`, from the `xclip` package.
- Windows (WSL): `powershell.exe -NoProfile -Command '[Console]::OutputEncoding = [Text.Encoding]::UTF8; Get-Clipboard'` and `iconv -f utf-8 -t utf-16le | clip.exe`. Without the encoding steps, Icelandic letters get garbled and names can slip through.
- Windows (Git Bash): `cat /dev/clipboard` and `cat > /dev/clipboard`.
