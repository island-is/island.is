module.exports = {
  "testRunner": "jest",
  "runnerConfig": "config.json",
  "apps": {
    "ios": {
      "type": "ios.app",
      "binaryPath": "./app/ios/build/Build/Products/Release-iphonesimulator/IslandApp.app",
      "build": "export RCT_NO_LAUNCH_PACKAGER=true && xcodebuild -workspace ./app/ios/IslandApp.xcworkspace -scheme IslandApp -configuration Release -sdk iphonesimulator -derivedDataPath ./app/ios/build ONLY_ACTIVE_ARCH=YES -quiet -UseModernBuildSystem=YES"
    },
    "ios-debug":{
      "type":"ios.app",
      "binaryPath":"./app/ios/build/IslandApp/Build/Products/Debug-iphonesimulator/IslandApp.app",
      "build": "export RCT_NO_LAUNCH_PACKAGER=true && xcodebuild -workspace ./app/ios/IslandApp.xcworkspace -scheme IslandApp -configuration Debug -sdk iphonesimulator -derivedDataPath ./app/ios/build ONLY_ACTIVE_ARCH=YES -quiet -UseModernBuildSystem=YES"
    },
    "android": {
      "type": "android.apk",
      "binaryPath": "../app/android/app/build/outputs/apk/release/app-release.apk"
    },
    "android-debug": {
      "type": "android.apk",
      "binaryPath": "../app/android/app/build/outputs/apk/release/app-release.apk"
    }
  },
  "artifacts": {
    "rootDir": "./app-e2e/artifacts",
    "plugins": {
      "log": { "enabled": true },
      "uiHierarchy": "enabled",
      "screenshot": {
        "enabled": true,
        "shouldTakeAutomaticSnapshots": true,
        "takeWhen": {
          "testStart": true,
          "testDone": true
        }
      },
      "video": {
        "simulator": {
          "codec": "hevc"
        }
      }
    }
  },
  "devices": {
    "simulator": {
      "type": "ios.simulator",
      "device": {
        "type": "iPhone 12"
      }
    },
    "emulator": {
      "type": "android.emulator",
      "device": {
        "avdName": "Pixel_3a_API_30_x86"
      }
    }
  },
  "configurations": {
    "ios": {
      "device": "simulator",
      "app": "ios"
    },
    "ios-debug": {
      "device": "simulator",
      "app": "ios-debug"
    },
    "android": {
      "device": "emulator",
      "app": "android"
    },
    "android-debug": {
      "device": "emulator",
      "app": "android-debug"
    }
  }
}
