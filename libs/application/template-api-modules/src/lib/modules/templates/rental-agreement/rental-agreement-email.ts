import { AttachmentEmailTemplateGenerator } from '../../../types'

export const generateRentalAgreementNotificationEmail: AttachmentEmailTemplateGenerator =
  (props) => {
    const {
      application,
      options: { email },
    } = props
    const subject = 'Hér er email'
    const body = `
  Hello
      `

    return {
      from: {
        name: 'Something',
        address: 'rakel@kolibri.is',
      },
      to: [
        {
          name: '',
          address: 'rakel@kolibri.is',
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
          encoding: 'binary',
        },
      ],
    }
  }
