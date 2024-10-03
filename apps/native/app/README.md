# Ísland.is App

This is the native app Ísland.is for iOS and Android.

## 1. Installation

To get started with the Ísland.is app, you need to install some dependencies. Run the following commands in your terminal:

```bash
yarn install
bundle install
npx pod-install
```

## 2. Building the App

### 2a. Building for iOS

To build the app for iOS, use the command:

```bash
yarn run ios
```

### 2b. Building for Android

To set up your environment for Android, follow the [official documentation](https://reactnative.dev/docs/environment-setup?platform=android&guide=native).

1. Open the project in Android Studio, which will generate the `local.properties` file. Alternatively, you can manually add a `local.properties` file to `/apps/native/app/android`.

2. Add the `google-services.json` file to `/apps/native/app/android/app`.

3. Open an Android emulator or connect a physical device.

4. Navigate to `/apps/native/app/android` in your terminal and run the following command to build the project:

   ```bash
   ./gradlew assembleDebug
   ```

5. To install the app on an **emulator**, run:

   ```bash
   adb install ./app/build/outputs/apk/dev/debug/app-dev-debug.apk*
   ```

6. To install the app on a **physical device**:

   a. List devices and their IDs:

   ```bash
   adb devices
   ```

   b. Use the `deviceId` from the previous command to install on the physical device:

   ```bash
   adb -s <deviceId> install ./app/build/outputs/apk/dev/debug/app-dev-debug.apk*
   ```

7. For both emulators and physical devices, run:

   ```bash
   adb reverse tcp:8081 tcp:8081
   ```

Finally, to start the application:

```bash
yarn start
```

or

```bash
yarn run android
```

## 3. Start Development Server

Start the development server with:

```bash
yarn start
```

## Deployment

### Publishing a Beta

To publish a beta version of the app, run:

```bash
yarn run beta
```

### After Release

After releasing a version, increment the app version using:

```bash
yarn run version:increment
```

Then commit the changes:

```bash
git add .
git commit -m "feat(native/app): release v1.0.0"
```

## NX Commands

Use NX commands to proxy arguments to `package.json` scripts:

```bash
nx run native-app:script --name=<some-script-from-package.json>
```

For example, to run frontend code generation:

```bash
nx run native-app:codegen/frontend-client
```

## Notes

- CI Jobs:
  - codegen
  - lint
  - build
  - test