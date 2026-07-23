import { getClientRuntimeEnv, isServerSide } from '@island.is/shared/utils'

const apiPath = '/api'
const graphqlPath = `${apiPath}/graphql`

/**
 * Runtime environment config (build-once/deploy-everywhere): values are
 * resolved from process.env at request time on the server, and on the client
 * they are read from the JSON script tag rendered by pages/_document.tsx.
 */

export type PublicRuntimeEnv = ReturnType<typeof buildPublicRuntimeEnv>

/**
 * Values safe to expose to the browser. Only called server-side;
 * the client receives the result via _document.tsx.
 *
 * NOTE: never add secrets here (e.g. the verification callback signing
 * secret) — everything in this object is serialized into the HTML.
 */
export const buildPublicRuntimeEnv = () => {
  const {
    API_EXTERNAL_BASEPATH = 'http://localhost:4444',
    BASEPATH = '/greida',
    ALLOW_APPLE_PAY,
  } = process.env

  return {
    graphqlEndpoint: `${API_EXTERNAL_BASEPATH}${graphqlPath}`,
    basepath: BASEPATH,
    allowApplePay: ALLOW_APPLE_PAY || 'false',
  }
}

/**
 * Isomorphic access to the public runtime environment.
 */
export const getPublicRuntimeEnv = (): PublicRuntimeEnv =>
  isServerSide()
    ? buildPublicRuntimeEnv()
    : (getClientRuntimeEnv() as PublicRuntimeEnv)

/**
 * Server-only values. Never serialized to the client. The verification
 * callback signing secret lives here and must never move to
 * buildPublicRuntimeEnv.
 */
export const getServerRuntimeEnv = () => {
  if (!isServerSide()) {
    throw new Error('getServerRuntimeEnv is server-side only')
  }

  const {
    API_INTERNAL_BASEPATH = 'http://localhost:4444',
    PAYMENTS_API_URL,
    APP_EXTERNAL_BASEPATH = 'http://localhost:4200',
    BASEPATH = '/greida',
    PAYMENTS_VERIFICATION_CALLBACK_SIGNING_SECRET,
  } = process.env

  return {
    apiUrl: `${API_INTERNAL_BASEPATH}${apiPath}`,
    graphqlEndpoint: `${API_INTERNAL_BASEPATH}${graphqlPath}`,
    paymentApiEndpoint: PAYMENTS_API_URL,
    verificationCallbackSigningSecret:
      PAYMENTS_VERIFICATION_CALLBACK_SIGNING_SECRET,
    appExternalUrl: `${APP_EXTERNAL_BASEPATH}${BASEPATH}`,
  }
}
