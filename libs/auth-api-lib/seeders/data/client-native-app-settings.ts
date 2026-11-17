import { QueryInterface } from 'sequelize'

import { compose } from './helpers'

/**
 * The native app settings of the Ísland.is app's clients: which builds may
 * authenticate as the client with an attestation, and what it demands of a
 * device. The same in every environment: IdentityServer accepts the builds
 * marked as development builds only where its config allows them.
 *
 * To change them, add a seeder: a change to who is trusted goes through review.
 */
const TEAM_ID = 'J3WWZR9JLF'
const STORE_APP = 'is.island.app'
const DEV_APP = 'is.island.app.dev'

/** The Play app signing key of the store app. */
const STORE_SIGNING_DIGEST =
  '12:C2:D3:52:EE:64:69:8E:D7:3E:63:25:D9:FE:E7:6E:AE:1A:9A:EF:8F:37:37:58:BB:71:5E:70:D7:FD:D3:05'
/** The signing key of the testing app. */
const DEV_SIGNING_DIGEST =
  'C2:B9:0C:C4:3F:7C:22:2E:65:C6:02:5D:AB:B8:5E:06:AF:F1:4E:AD:FC:FE:CF:46:28:B2:E0:11:23:9B:9C:C4'

const base = {
  registrationIdleLifetimeInDays: 90,
  requirements: {
    androidMinimumSecurityLevel: 'TrustedEnvironment',
    androidRequireVerifiedBoot: true,
    androidRequireBiometricOnlyKey: true,
  },
}

const settings = {
  '@island.is/app': {
    ...base,
    apple: [
      { teamId: TEAM_ID, bundleId: STORE_APP },
      {
        teamId: TEAM_ID,
        bundleId: DEV_APP,
        allowDevelopmentEnvironment: true,
        developmentBuild: true,
      },
    ],
    android: [
      {
        packageName: STORE_APP,
        signingCertificateDigests: [STORE_SIGNING_DIGEST],
      },
      {
        packageName: DEV_APP,
        signingCertificateDigests: [DEV_SIGNING_DIGEST],
        developmentBuild: true,
      },
    ],
  },
  // The testing app's own client in production: its builds are its real ones.
  '@island.is/island.dev-appid': {
    ...base,
    apple: [
      {
        teamId: TEAM_ID,
        bundleId: DEV_APP,
        allowDevelopmentEnvironment: true,
      },
    ],
    android: [
      {
        packageName: DEV_APP,
        signingCertificateDigests: [DEV_SIGNING_DIGEST],
      },
    ],
  },
}

const setNativeApp = (clientId: keyof typeof settings) => async (
  queryInterface: QueryInterface,
) => {
  // No rows where the client doesn't exist.
  await queryInterface.sequelize.query(
    'update client set native_app = :nativeApp::jsonb where client_id = :clientId',
    {
      replacements: {
        clientId,
        nativeApp: JSON.stringify(settings[clientId]),
      },
    },
  )
}

export const up = compose(
  setNativeApp('@island.is/app'),
  setNativeApp('@island.is/island.dev-appid'),
)
