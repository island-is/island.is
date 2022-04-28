# Native

This is the native app directory within the monorepo

## Getting started

### Prerequisite

Install additional native dependencies

```bash
cd apps/native
yarn install
```

### Starting app

For iOS development

```bash
yarn nx run-ios native-app
```

For Android development

```bash
yarn nx run-android native-app
```

### Starting storybook

With the app running, open the storybook screen and then start storybook to navigate different components and play with their knobs through the web UI and displayed in the app

```
yarn nx storybook native-island-ui
```


### Testing with detox

Build the testing apps

```
cd apps/native
yarn detox:build:ios
yarn detox:build:android
```

Run the e2e tests

```
cd apps/native
yarn detox:test:ios
yarn detox:test:android
```

### Deploy CodePush

Inside ./apps/native/app folder, do:

#### iOS
```bash
yarn nx bundle-ios native-app --bundle-output ./build-ios-release/main.jsbundle --assets-dest ./build-ios-release --dev false
mv ../../.././build-ios-release/main.jsbundle ./build-ios-release/main.jsbundle
appcenter codepush release -a Stafraent-Island/Island-ios -t 1.0.0 -c ./build-ios-release -d production -x
```

#### Android
```bash
yarn nx bundle-android native-app --bundle-output ./build-android-release/main.jsbundle --assets-dest ./build-android-release --dev false
mv ../../.././build-android-release/main.jsbundle ./build-android-release/main.jsbundle
appcenter codepush release -a Stafraent-Island/Island-android -t 1.0.0 -c ./build-android-release -d production -x
```

## Packages needed in root package json

### Dependencies
- react-native @ 0.64.0

### devDependencies
- @nrwl/react-native @ 11.4.1
- @react-native-community/cli-platform-android @ 4.13.0
- @react-native-community/cli-platform-ios @ 4.13.0
- @react-native-community/cli @ 4.14.0
- @storybook/react-native-server @ 5.3.23
- @storybook/react-native @ 5.3.25
- @testing-library/jest-native @ 4.0.1
- @testing-library/react-native @ 7.2.0
- @types/react-native @ 0.63.52
- jest-react-native @ 18.0.0
- metro-react-native-babel-preset @ 0.65.2
- metro-resolver @ 0.65.2
- metro @ 0.65.2
- react-native-storybook-loader @ 2.0.2

