import getConfig from 'next/config'

const {
  publicRuntimeConfig: { basepath },
} = getConfig()

export const generateFormHtml = ({
  postUrl,
  scriptPath,
  verificationFields,
}: {
  postUrl: string
  scriptPath?: string
  verificationFields: { name: string; value: string }[]
}): string => {
  if (scriptPath) {
    console.log(
      `intentionally skipping ${scriptPath} for CSP reasons while testing`,
    )
  }
  const fieldsHtml = verificationFields
    .map(
      (field) =>
        `<input type="hidden" name="${field.name}" value="${field.value}">`,
    )
    .join('')

  // Why import "/scripts/submitForm" (public/scripts/submitForm.js) here?
  // Importing it from an existing file avoids inline scripts in the HTML
  // which is against the Content Security Policy
  return `
      <form id="threeDSForm" action="${postUrl}" method="POST">
        ${fieldsHtml}
        <input type="submit" style="display: none;" />
      </form>
      <script src="${`${basepath ?? ''}/scripts/submitForm.js`}"></script>
    `
}

export const generatePopupHtml = ({
  postUrl,
  scriptPath,
  verificationFields,
}: {
  postUrl: string
  scriptPath?: string
  verificationFields: { name: string; value: string }[]
}): string => {
  return `
    <html>
      <head>
        <title>Ísland.is | </title>
      </head>
      <body>
        ${generateFormHtml({ postUrl, scriptPath, verificationFields })}
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
