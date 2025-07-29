import { EmailTemplateGenerator } from '../../../../types'
import { Identity } from '../types'
import { getValueViaPath } from '@island.is/application/core'

export const generateSyslumennNotifyErrorEmail: EmailTemplateGenerator = (
  props,
) => {
  const {
    application,
    options: { email },
  } = props

  const syslumennEmail = 'hjalp@syslumenn.is'

  const identityData = application.externalData.identity?.data as Identity

  const selectedProperty = getValueViaPath(
    application.answers,
    'selectProperty.property',
  ) as { propertyNumber: string }

  const subject = 'Umsókn um veðbókarvottorð'
  const body = `
      Villa hefur komið upp í samskiptum milli island.is og sýslumanna,
      vegna kaupa á veðbókarvottorði fyrir ${identityData.nationalId},
      fasteignanúmer ${selectedProperty.propertyNumber}.`

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
