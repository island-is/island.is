import { EmailTemplateGenerator } from '../../../../types'
import { logger } from '@island.is/logging'

export const generateSyslumennNotifyErrorEmail: EmailTemplateGenerator = (
  props,
) => {
  logger.info('AfgreidaSakavottord Generating error email')
  const {
    application,
    options: { email },
  } = props

  const syslumennEmail = 'hjalp@syslumenn.is'

  const subject = 'Umsókn um sakavottorð'
  const body = `
      Villa hefur komið upp í samskiptum milli island.is og sýslumanna, vegna kaupa á sakavottorði fyrir ${application.applicant}.
      `

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: '',
        address: syslumennEmail,
      },
    ],
    subject,
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
  }
}
