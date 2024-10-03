## fastlane Documentation

### Installation

Ensure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, visit [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane).

### Available Actions

#### Android

##### android play_store_upload

```sh
[bundle exec] fastlane android play_store_upload
```

Uploads a new AAB to the Google Play store.

##### android promote

```sh
[bundle exec] fastlane android promote
```

Promotes a build to a specific release track on the Google Play store.

##### android increment_version

```sh
[bundle exec] fastlane android increment_version
```

Increments the version number for the Android app.

##### android beta

```sh
[bundle exec] fastlane android beta
```

Submits a new Beta Build.

---

This `README.md` is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found at [fastlane.tools](https://fastlane.tools).

The documentation for _fastlane_ can be found at [docs.fastlane.tools](https://docs.fastlane.tools).
