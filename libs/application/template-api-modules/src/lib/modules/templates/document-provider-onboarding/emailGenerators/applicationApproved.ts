import { dedent } from 'ts-dedent'
import get from 'lodash/get'

import { EmailTemplateGenerator } from '../../../../types'

export const generateApplicationApprovedEmail: EmailTemplateGenerator = (
  props,
) => {
  const {
    application,
    options: { locale, clientLocationOrigin },
  } = props

  const applicantEmail = get(application.answers, 'applicant.email')
  const applicationLink = `${clientLocationOrigin}/umsokn/${application.id}`

  // TODO translate using locale
  const subject = locale === 'is' ? 'Umsókn samþykkt' : 'Application approved'
  const body =
    locale === 'is'
      ? dedent(`Góðan dag.

        Umsókn þín um að gerast skjalaveita hefur verið samþykkt.
        <a href=${applicationLink} target="_blank">Smelltu hér til þess að halda áfram í útfærslu og prófanir</a>.
        
        Með kveðju,
        Starfsfólk island.is
      `)
      : dedent(`Hello.

        Your application for document providing has been approved.
        <a href=${applicationLink} target="_blank">Click here to implement and test</a>.
        Best regards,
        Island.is
      `)

  return {
    from: {
      name: 'Devland.is',
      address: 'development@island.is',
    },
    to: [
      {
        name: '',
        address: applicantEmail as string,
      },
    ],
    subject,
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
  }
}
