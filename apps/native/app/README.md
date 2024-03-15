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
