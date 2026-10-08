import { getPublicRuntimeEnv } from '../environments/runtimeEnvironment'

type FormField = { name: string; value: string }

export interface ThreeDSFormData {
  postUrl: string
  scriptPath?: string | null
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
  verificationFields,
  tdsMethodPostUrl,
  tdsMethodFields,
  authenticationType,
}: ThreeDSFormData): string => {
  const { basepath } = getPublicRuntimeEnv()

  const charset =
    verificationFields.find((field) => field.name === '_charset_')?.value ||
    'UTF-8'

  const hasTdsMethod = !!tdsMethodPostUrl && !!tdsMethodFields?.length
  const hasTxidField = verificationFields.some((field) => field.name === 'txid')

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

  // The gateway script submits the form itself (after the 3DS Method when
  // present). Our own submit script is only a fallback for responses without
  // a scriptPath. Both are external files, inline scripts are blocked by CSP.
  const submitScriptSrc =
    scriptPath || `${basepath ?? ''}/scripts/submitForm.js`

  return `
      <div id="flowType" data-value="${escapeHtml(
        authenticationType ?? '',
      )}" style="display: none;"></div>
      ${tdsMethodHtml}
      <form id="webform0" action="${escapeHtml(
        postUrl,
      )}" method="POST" accept-charset="${escapeHtml(charset)}">
        ${renderHiddenInputs(verificationFields)}
        ${
          hasTdsMethod && !hasTxidField
            ? '<input type="hidden" name="txid" value="">'
            : ''
        }
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
