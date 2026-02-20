import { background } from '@storybook/theming'

const IS_DEV = process.env.APP_VARIANT === 'development'
const IS_PROD = process.env.APP_VARIANT === 'production'

const getAppName = () => (IS_PROD ? 'Ísland.is' : 'Ísland.dev')
const getUniqueIdentifier = () =>
  IS_PROD ? 'is.island.app' : 'is.island.app.dev'
const getIconFolder = () =>
  IS_PROD ? './assets/images/island_is' : './assets/images/island_dev'
const getGoogleServicesFile = () =>
  IS_PROD ? `GoogleService-Info.plist` : `GoogleService-Info.dev.plist`

export default ({ config }) => {
  return {
    ...config,
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
          dark: {
            image: `${getIconFolder()}/splashscreen.png`,
            backgroundColor: '#000000',
          },
          imageWidth: 200,
        },
      ],
      [
        'react-native-app-auth',
        {
          redirectUrls: [
            `${getUniqueIdentifier()}.auth://oauth`,
          ],
        },
      ],
      './plugins/with-app-brand',
    ],
  }
}
