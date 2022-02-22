import { EmailTemplateGenerator } from '../../../../types'
import { NationalRegistry } from '../types'

export const generateSyslumennSubmitRequestErrorEmail: EmailTemplateGenerator = (
  props,
) => {
  const {
    application,
    options: { email },
  } = props

  const syslumennEmail = 'vefur@syslumenn.is'

  const nationalRegistryData = application.externalData.nationalRegistry
    ?.data as NationalRegistry

  const subject = 'Umsókn um veðbókarvottorð'
  const body = `
      Villa hefur komið upp í samskiptum milli island.is og sýslumanna,
      vegna beiðni um lagfæringu á veðbókarvottorði fyrir ${nationalRegistryData.nationalId},
      fasteignanúmer <VANTAR>.` // TODOx sækja fasteignanúmer frá externalData

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
