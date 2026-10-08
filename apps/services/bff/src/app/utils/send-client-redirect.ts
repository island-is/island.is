import { randomBytes } from 'crypto'
import type { Response } from 'express'

const escapeHtml = (str: string) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

// JSON.stringify does not escape "<", so "</script>" in the url could close the script tag
const toScriptString = (str: string) =>
  JSON.stringify(str).replace(/</g, '\\u003c')

/**
 * Redirects the browser with an HTML page instead of a 302 response.
 *
 * Mobile operating systems open the native app when a redirect chain that the
 * user started on another domain (e.g. the identity server) ends on a universal
 * link / app link. A navigation started by a page on the target domain, without
 * a user gesture, stays in the browser.
 *
 * The script redirects before first paint, and the meta refresh is a fallback.
 */
export const sendClientRedirect = (res: Response, url: string) => {
  const nonce = randomBytes(16).toString('base64')

  res
    .status(200)
    .set({
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Content-Security-Policy': `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`,
    })
    .send(
      `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0;url=${escapeHtml(url)}">
<style nonce="${nonce}">html{background:#fff}</style>
<script nonce="${nonce}">location.replace(${toScriptString(url)})</script>
</head>
<body></body>
</html>`,
    )
}
