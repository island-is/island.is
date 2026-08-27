// Content-Security-Policy for the SDF (App Router) app.

export const generateNonce = () => {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

export const buildCsp = (nonce: string) =>
  [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' blob: data:`,
    `font-src 'self'`,
    `connect-src 'self'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
  ].join('; ')

/** Header name Next.js reads to auto-nonce its scripts, and the browser enforces. */
export const CSP_HEADER = 'Content-Security-Policy'

/** Request header used to forward the nonce to the rendered layout/components. */
export const NONCE_HEADER = 'x-nonce'
