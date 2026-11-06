const IS_DEV = process.env.APP_VARIANT === 'development'
const IS_PROD = process.env.APP_VARIANT === 'production'

const getAppName = () => (IS_PROD ? 'Ísland.is' : 'Ísland.dev')
const getUniqueIdentifier = () =>
  IS_PROD ? 'is.island.app' : 'is.island.app.dev'
const getIconFolder = () =>
  IS_PROD ? './assets/images/island_is' : './assets/images/island_dev'
const getGoogleServicesFile = () =>
  IS_PROD ? `GoogleService-Info.plist` : `GoogleService-Info.dev.plist`
// Today's UTC date as yy.mm.dd, matching the auto-release version format.
const getDateVersion = () =>
  new Date().toISOString().slice(2, 10).replaceAll('-', '.')

export default ({ config }) => {
  return {
    ...config,
    // Auto-release builds set the marketing version (yy.mm.dd) during
    // prebuild; other builds use today's date so they are never older than a
    // released version.
    version: process.env.APP_VERSION || getDateVersion(),
    displayName: getAppName(),
    icon: `${getIconFolder()}/icon.png`,
    scheme: getUniqueIdentifier(),
    splash: {
      ...config.splash,
      image: `${getIconFolder()}/splashscreen.png`,
    },
    ios: {
      googleServicesFile: `./assets/firebase/${getGoogleServicesFile()}`,
      ...config.ios,
      entitlements: {
        ...config.ios.entitlements,
        'com.apple.security.application-groups': [
          'group.is.island.app',
          ...(!IS_PROD ? ['group.is.island.app.dev'] : []),
        ],
        // TestFlight and App Store builds always attest in production and
        // ignore this, so only locally signed dev builds need it.
        ...(!IS_PROD && {
          'com.apple.developer.devicecheck.appattest-environment':
            'development',
        }),
      },
      infoPlist: {
        ...config.ios.infoPlist,
        CFBundleDisplayName: getAppName(),
      },
      bundleIdentifier: getUniqueIdentifier(),
      icon: {
        light: `${getIconFolder()}/icon.png`,
        dark: `${getIconFolder()}/icon_dark.png`,
        tinted: `./assets/images/icon_monochrome.png`,
      },
    },
    android: {
      ...config.android,
      package: getUniqueIdentifier(),
      ...(process.env.ANDROID_VERSION_CODE && {
        versionCode: parseInt(process.env.ANDROID_VERSION_CODE, 10),
      }),
      adaptiveIcon: {
        foregroundImage: `${getIconFolder()}/icon.png`,
        backgroundColor: '#ffffff',
        monochrome: `./assets/images/icon_monochrome.png`,
      },
    },
    plugins: [
      ...config.plugins,
      [
        'expo-splash-screen',
        {
          backgroundColor: '#ffffff',
          image: `${getIconFolder()}/splashscreen.png`,
          imageWidth: 200,
        },
      ],
      [
        'react-native-app-auth',
        {
          redirectUrls: [`${getUniqueIdentifier()}.auth://oauth`],
        },
      ],
      './plugins/with-island-app',
    ],
  }
}
