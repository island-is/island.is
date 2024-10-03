# Ísland.is App

This is the native app Ísland.is for iOS and Android.

## 1. Installation

```bash
yarn install
bundle install
npx pod-install
```

## 2a. Building for iOS

```bash
yarn run ios
```

## 2b. Building for Android

1. Follow [Android setup documentation](https://reactnative.dev/docs/environment-setup?platform=android&guide=native).
2. Open the project in Android Studio.
3. Ensure `local.properties` and `google-services.json` are added:

   - `local.properties` in `/apps/native/app/android`
   - `google-services.json` in `/apps/native/app/android/app`

4. Open an Android emulator or connect a device.

Run the following in `/apps/native/app/android`:

```bash
# Build the project
./gradlew assembleDebug
```

### For an Emulator:

```bash
# Install APK on emulator
adb install ./app/build/outputs/apk/dev/debug/app-dev-debug.apk
```

### For a Physical Device:

```bash
# List devices
adb devices

# Install APK on device
adb -s <deviceId> install ./app/build/outputs/apk/dev/debug/app-dev-debug.apk
```

### For Both:

```bash
# Forward port
adb reverse tcp:8081 tcp:8081
```

Finally:

```bash
yarn start
```

or

```bash
yarn run android
```

## 3. Start Development Server

```bash
yarn start
```

## Deployment

### Publishing a Beta

```bash
yarn run beta
```

### After Release

Increment the app version and commit:

```bash
yarn run version:increment
git add .
git commit -m "feat(native/app): release v1.0.0"
```

## NX Commands

Example of running NX commands:

```bash
nx run native-app:script --name=<script-name>
```

```bash
nx run native-app:codegen/frontend-client
```

## NOTES

- CI Jobs: codegen, lint, build, test