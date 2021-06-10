import { dedent } from 'ts-dedent'
import get from 'lodash/get'

import { EmailTemplateGenerator } from '../../../../types'
import { ApplicationConfigurations } from '@island.is/application/core'

export const generateAssignOtherParentApplicationEmail: EmailTemplateGenerator = (
  props,
) => {
  const {
    application,
    options: { email, clientLocationOrigin },
  } = props

  const otherParentEmail = get(application.answers, 'otherParentEmail')

  if (!otherParentEmail) {
    throw new Error('Could not find other parent email')
  }

  // TODO handle different locales
  const subject = 'Yfirferð á umsókn um fæðingarorlof'
  const body = dedent(`Góðan dag.

        Umsækjandi með kennitölu ${application.applicant} hefur skráð þig sem foreldri í umsókn sinni og er að óska eftir réttindum frá þér.
    
        Ef þú áttir von á þessum tölvupósti þá getur þú <a href="${clientLocationOrigin}/umsoknir/${ApplicationConfigurations.ParentalLeave.slug}/${application.id}" target="_blank">smellt hér til þess að fara yfir umsóknina</a>.
    
        Með kveðju,
        Fæðingarorlofssjóðsjóður
      `)

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: '',
        address: otherParentEmail as string,
      },
    ],
    subject,
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
  }
}
