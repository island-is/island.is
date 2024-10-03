## Fastlane Documentation

### Installation

Ensure the latest Xcode command line tools are installed:

```bash
xcode-select --install
```

For _fastlane_ installation, visit [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane).

### Available Actions

#### Android

- **Play Store Upload**

  Upload a new AAB to the Google Play store.

  ```bash
  [bundle exec] fastlane android play_store_upload
  ```

- **Promote**

  ```bash
  [bundle exec] fastlane android promote
  ```

- **Increment Version**

  ```bash
  [bundle exec] fastlane android increment_version
  ```

- **Beta**

  Submit a new Beta build.

  ```bash
  [bundle exec] fastlane android beta
  ```

---

This README.md is auto-generated and will update every time [_fastlane_](https://fastlane.tools) is run.

Find more information at [fastlane.tools](https://fastlane.tools) and _fastlane_ documentation at [docs.fastlane.tools](https://docs.fastlane.tools).
