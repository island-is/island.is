import { getPublicRuntimeEnv } from '../environments/runtimeEnvironment'

type FormField = { name: string; value: string }

export interface ThreeDSFormData {
  postUrl: string
  scriptPath?: string | null
  cardVerificationRawResponse?: string | null
  verificationFields: FormField[]
  tdsMethodPostUrl?: string | null
  tdsMethodFields?: FormField[] | null
  authenticationType?: string | null
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const renderHiddenInputs = (fields: FormField[]) =>
  fields
    .map(
      (field) =>
        `<input type="hidden" name="${escapeHtml(
          field.name,
        )}" value="${escapeHtml(field.value)}">`,
    )
    .join('')

// Only load the gateway script from the gateway's own https domain (the CSP
// enforces the same host for scripts).
const isGatewayScriptUrl = (url: string) => {
  try {
    const { protocol, hostname } = new URL(url)
    return protocol === 'https:' && hostname.endsWith('.valitor.com')
  } catch {
    return false
  }
}

// The gateway's scriptPath is not always its execution script: Rapyd UAT has
// returned a logging library (first a Datadog agent, then
// datadog-3ds-core.js), which never submits the form. The gateway's own 3DS
// page (cardVerificationRawResponse) loads the execution script (red.js) as
// its last script, so prefer that and fall back to scriptPath.
const getGatewayScriptUrl = (
  scriptPath?: string | null,
  rawResponse?: string | null,
) => {
  const rawResponseScripts = Array.from(
    (rawResponse ?? '').matchAll(/<script[^>]*\ssrc=["']([^"']+)["']/gi),
    (match) => match[1],
  ).filter(isGatewayScriptUrl)

  if (rawResponseScripts.length > 0) {
    return rawResponseScripts[rawResponseScripts.length - 1]
  }

  if (scriptPath && !isGatewayScriptUrl(scriptPath)) {
    console.error('Ignoring 3DS scriptPath outside the gateway domain', {
      scriptPath,
    })
    return null
  }

  return scriptPath ?? null
}

// Builds the custom 3DS redirection form. Rapyd requires merchants using
// postUrl + verificationFields to run the form with the gateway script from
// `scriptPath`, unchanged and from its remote location, and to perform the 3DS
// Method (hidden iframe + form) when `tdsMethodPostUrl` is present. The script
// looks up the element ids used below (webform0, tdsMmethodForm,
// tdsMmethodTgtFrame, flowType, txid), so they must not be renamed.
// See CardVerification "New rules for users using verification fields and post
// url in response" in the RapydGateway API documentation.
export const generateFormHtml = ({
  postUrl,
  scriptPath,
  cardVerificationRawResponse,
  verificationFields,
  tdsMethodPostUrl,
  tdsMethodFields,
  authenticationType,
}: ThreeDSFormData): string => {
  const { basepath } = getPublicRuntimeEnv()

  const charset =
    verificationFields.find((field) => field.name === '_charset_')?.value ||
    'UTF-8'

  const tdsMethodHtml =
    tdsMethodPostUrl && tdsMethodFields?.length
      ? `
      <iframe id="tdsMmethodTgtFrame" name="tdsMmethodTgtFrame" title="3DS Method" style="display: none;"></iframe>
      <form id="tdsMmethodForm" action="${escapeHtml(
        tdsMethodPostUrl,
      )}" method="POST" target="tdsMmethodTgtFrame" accept-charset="${escapeHtml(
          charset,
        )}" style="display: none;">
        ${renderHiddenInputs(tdsMethodFields)}
      </form>`
      : ''

  // The gateway script writes the 3DS Method outcome into a txid input
  const needsTxidField =
    !!tdsMethodHtml &&
    !verificationFields.some((field) => field.name === 'txid')

  // The gateway script submits the form itself (after the 3DS Method when
  // present). Our own submit script is only a fallback for responses without
  // a usable gateway script. Both are external files, inline scripts are
  // blocked by CSP.
  const submitScriptSrc =
    getGatewayScriptUrl(scriptPath, cardVerificationRawResponse) ??
    `${basepath ?? ''}/scripts/submitForm.js`

  return `
      <div id="flowType" data-value="${escapeHtml(
        authenticationType ?? '',
      )}" style="display: none;"></div>
      ${tdsMethodHtml}
      <form id="webform0" action="${escapeHtml(
        postUrl,
      )}" method="POST" accept-charset="${escapeHtml(charset)}">
        ${renderHiddenInputs(verificationFields)}
        ${needsTxidField ? '<input type="hidden" name="txid" value="">' : ''}
        <input type="submit" style="display: none;" />
      </form>
      <script src="${escapeHtml(submitScriptSrc)}"></script>
    `
}

export const generatePopupHtml = (formData: ThreeDSFormData): string => {
  return `
    <html>
      <head>
        <title>Ísland.is | </title>
      </head>
      <body>
        ${generateFormHtml(formData)}
      </body>
    </html>
  `
}

export const generatePopupLoadingHtml = (): string => {
  return `
    <html>
      <head>
        <title>Ísland.is | </title>
      </head>
      <body>
        <p>Sæki upplýsingar ...</p>
      </body>
    </html>
  `
}
