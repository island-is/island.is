## fastlane Documentation

### Installation

Ensure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For detailed _fastlane_ installation instructions, visit [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane).

### Available Actions

#### iOS

##### `ios increment_version`

```sh
[bundle exec] fastlane ios increment_version
```

This lane increments the version number.

##### `ios beta`

```sh
[bundle exec] fastlane ios beta
```

Push a new beta build to TestFlight.

##### `ios promote`

```sh
[bundle exec] fastlane ios promote
```

Promote a build from TestFlight to production.

---

This `README.md` is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

For more information, visit the [_fastlane_ website](https://fastlane.tools) and refer to the [_fastlane_ documentation](https://docs.fastlane.tools).
