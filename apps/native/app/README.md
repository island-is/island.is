# Ísland.is App

This is the native app Ísland.is for iOS and Android.

## 1. Installation

```bash
yarn install
bundle install
npx pod-install
```

### 2a. Building for iOS

```bash
yarn run ios
```

### 2b. Building for Android

Follow documentation for setting up android [here](https://reactnative.dev/docs/environment-setup?platform=android&guide=native).

Open the project in android studio and then local.properties should be created, if you want to skip that, make sure to:

Add `local.properties` file to `/apps/native/app/android`

Add `google-services.json` file to `/apps/native/app/android/app`

Open up an android emulator or connect a physical device

in `/apps/native/app/android` run the following commands:

```ts
// Build the project
./gradlew assembleDebug
```

If using an **emulator** do the following:

```ts
// Move to device
adb install ./app/build/outputs/apk/dev/debug/app-dev-debug.apk*
```

If using a **physical device** do the following:

```ts
// List devices and their ids
adb devices

// Use deviceId from previous command to move to physical device
adb -s <deviceId> install  ./app/build/outputs/apk/dev/debug/app-dev-debug.apk*
```

For both emulators and physical devices:

```ts
// fix port for device
adb reverse tcp:8081 tcp:8081
```

and finally

```bash
yarn start
```

or

```bash
yarn run android
```

### 3. Start development server

```
yarn start
```

## Deployment

### Publishing a Beta

```bash
yarn run beta
```

### After release

Make sure to increment the version of the app by running `yarn run version:increment` and commit the changes.

```bash
yarn run version:increment
git add .
git commit -m "feat(native/app): release v1.0.0"
```

## NX commands

NX command example to proxy arguments to `package.json` scripts

```bash
nx run native-app:script --name=<some-script-from-package.json>
```

```bash
nx run native-app:codegen/frontend-client
```

## NOTES

- ci jobs
  - codegen
  - lint
  - build
  - test

## License Widgets

The license widget have hard-coded values for the license type, its display name, background and agency image.
So if you need to support new license types, or update existing ones, you need to update the corresponding files:

### `ios/LicenseWidget/AppIntent.swift`

Add or update license types, display names, background and agency image in the `LicenseType` enum.

### `android/app/main/java/is/island/app/LicenseWidgetConfigActivity.java`

Edit the `LICENSE_TYPES` and `LICENSE_DISPLAY_NAMES`.

### `android/app/main/java/is/island/app/LicenseWidgetProvider.java`

Edit the following methods:
- `getLicenseDisplayTitle`
- `getAgencyIconResource`
- `getBackgroundColors`

### `android/app/src/main/res/drawable`

If you need to add new agency images, add them to the `drawable` folder. The images should be named according to the license type they represent, e.g., `license_type_name.png`, see example files.
