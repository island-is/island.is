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

Make sure to have JDK v17 installed

Add `local.properties` file to `/apps/native/app/android`

Add `google-services.json` file to `/apps/native/app/android/app`

Add the following lines to your shell configuration file:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

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

note:
If you get an error regarding `:expo-modules-core:downloadBoost` then look at [this](https://github.com/expo/expo/issues/19596#issuecomment-1880842689) fix. But the pathces have been added to git should it should work.

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
