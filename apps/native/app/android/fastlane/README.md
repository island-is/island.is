## Fastlane Documentation

### Installation

Ensure Xcode command line tools are installed:

```bash
xcode-select --install
```

For _fastlane_ installation, visit the [Installing _fastlane_ guide](https://docs.fastlane.tools/#installing-fastlane).

### Available Actions

#### Android

- **Play Store Upload**

  Upload a new AAB to the Google Play Store.

  ```bash
  [bundle exec] fastlane android play_store_upload
  ```

- **Promote**

  Promote an Android build to the next release:

  ```bash
  [bundle exec] fastlane android promote
  ```

- **Increment Version**

  Increment the version code:

  ```bash
  [bundle exec] fastlane android increment_version
  ```

- **Beta**

  Submit a new beta build:

  ```bash
  [bundle exec] fastlane android beta
  ```

---

This README.md is auto-generated and updates every time [_fastlane_](https://fastlane.tools) is run.

Find more information at [fastlane.tools](https://fastlane.tools) and consult the _fastlane_ documentation at [docs.fastlane.tools](https://docs.fastlane.tools).