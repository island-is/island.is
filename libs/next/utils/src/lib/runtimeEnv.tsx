/**
 * Runtime environment support for Next.js (pages router) apps, preserving the
 * build-once/deploy-everywhere model:
 *
 * - Server code reads values from `process.env` when constructing its config.
 * - The app's `pages/_document.tsx` renders `<RuntimeEnv />` in `<Head>`,
 *   serializing the public config into a JSON script tag on every request
 *   (same idiom as the `__SI_ENVIRONMENT__` tag injected by
 *   scripts/dockerfile-assets/bash/extract-environment.js for static SPAs).
 * - Client code reads the values back from that script tag.
 *
 * Usage in `pages/_document.tsx`:
 *
 *   <RuntimeEnv env={buildPublicRuntimeEnv()} />
 *
 * Usage in isomorphic code (see each app's environment module):
 *
 *   const env = isServerSide() ? buildPublicEnvFromProcessEnv() : getClientRuntimeEnv()
 */

export const NEXT_RUNTIME_ENV_SCRIPT_ID = '__NEXT_RUNTIME_ENV__'

export type RuntimeEnv = Record<string, string | number | boolean | undefined>

export const isServerSide = () => typeof window === 'undefined'

/**
 * Serializes the public runtime environment for embedding in an HTML script
 * tag. Escapes `<` to prevent the JSON payload from terminating the script
 * element (XSS via `</script>` in a value).
 */
export const serializeRuntimeEnv = (publicEnv: RuntimeEnv): string =>
  JSON.stringify(publicEnv).replace(/</g, '\\u003c')

/**
 * Renders the public runtime environment as a JSON script tag. Render inside
 * `<Head>` in `pages/_document.tsx`; the client reads the values back with
 * `getClientRuntimeEnv`.
 */
export const RuntimeEnv = ({ env }: { env: RuntimeEnv }) => (
  <script
    id={NEXT_RUNTIME_ENV_SCRIPT_ID}
    type="application/json"
    dangerouslySetInnerHTML={{ __html: serializeRuntimeEnv(env) }}
  />
)

let clientRuntimeEnv: RuntimeEnv | undefined

/**
 * Reads the public runtime environment from the script tag rendered by
 * `<RuntimeEnv />` in `_document.tsx`. Client-side only; parsed once and
 * memoized.
 */
export const getClientRuntimeEnv = (): RuntimeEnv => {
  if (isServerSide()) {
    throw new Error(
      'getClientRuntimeEnv is client-side only. On the server, build the config from process.env instead.',
    )
  }

  if (!clientRuntimeEnv) {
    const script = document.getElementById(NEXT_RUNTIME_ENV_SCRIPT_ID)
    if (!script && process.env.NODE_ENV !== 'production') {
      console.warn(
        `Runtime env script tag #${NEXT_RUNTIME_ENV_SCRIPT_ID} not found — is <RuntimeEnv /> rendered in this app's pages/_document.tsx?`,
      )
    }
    clientRuntimeEnv = JSON.parse(script?.textContent || '{}')
  }

  return clientRuntimeEnv as RuntimeEnv
}
