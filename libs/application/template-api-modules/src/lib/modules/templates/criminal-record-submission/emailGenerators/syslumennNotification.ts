import { AttachmentEmailTemplateGenerator } from '../../../../types'

export const generateSyslumennNotificationEmail: AttachmentEmailTemplateGenerator = (
  props,
  fileContent,
  recipientEmail,
) => {
  const {
    application,
    options: { email },
  } = props
  const subject = 'Umsókn um sakavottorð'
  const body = `
      Villa hefur komið upp í samskiptum milli island.is og sýslumanna.
      `

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: '',
        address: recipientEmail,
      },
    ],
    subject,
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
    attachments: [
      {
        filename: `${application.id}.pdf`,
        content: fileContent,
        encoding: 'binary',
      },
    ],
  }
}
