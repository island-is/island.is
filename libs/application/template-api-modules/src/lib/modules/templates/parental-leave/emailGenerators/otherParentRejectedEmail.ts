import { dedent } from 'ts-dedent'
import get from 'lodash/get'

import { EmailTemplateGenerator } from '../../../../types'
import { ApplicationConfigurations } from '@island.is/application/core'

export const generateOtherParentRejected: EmailTemplateGenerator = (props) => {
  const {
    application,
    options: { email, clientLocationOrigin },
  } = props

  const to =
    get(application.answers, 'applicant.email') ||
    get(application.externalData, 'userProfile.data.email')

  // TODO handle different locales
  const subject = `${
    application.name ? `${application.name}: ` : ''
  }Beiðni um tilfærslu réttinda hafnað`
  const body = dedent(`Góðan dag.

        Beiðni þinni um tilfærslu réttinda hefur verið hafnað af hinu foreldrinu.
    
        Til þess að skoða umsókn þína getur þú <a href="${clientLocationOrigin}/umsoknir/${ApplicationConfigurations.ParentalLeave.slug}/${application.id}" target="_blank">smellt hér</a>.
    
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
        address: to as string,
      },
    ],
    subject,
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
  }
}
