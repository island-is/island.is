import { EmailTemplateGenerator } from '../../../../types'
import { NationalRegistry } from '../types'

export const generateSyslumennNotifyErrorEmail: EmailTemplateGenerator = (
  props,
) => {
  const {
    application,
    options: { email },
  } = props

  const syslumennEmail = 'vefur@syslumenn.is'

  const nationalRegistryData = application.externalData.nationalRegistry
    ?.data as NationalRegistry

  const subject = 'Umsókn um sakavottorð'
  const body = `
      Villa hefur komið upp í samskiptum milli island.is og sýslumanna, vegna kaupa á sakavottorði fyrir ${nationalRegistryData.nationalId}.
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
