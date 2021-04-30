import { dedent } from 'ts-dedent'
import get from 'lodash/get'
import { getSlugFromType } from '@island.is/application/core'

import { EmailTemplateGenerator } from '../../../../types'

export const generateApplicationApprovedEmail: EmailTemplateGenerator = (
  props,
) => {
  const {
    application,
    options: { locale, clientLocationOrigin, email },
  } = props

  const applicantEmail = get(application.answers, 'applicant.email')
  const applicationSlug = getSlugFromType(application.typeId) as string
  const applicationLink = `${clientLocationOrigin}/${applicationSlug}/${application.id}`

  // TODO translate using locale
  const subject = locale === 'is' ? 'Umsókn samþykkt' : 'Application approved'
  const body =
    locale === 'is'
      ? dedent(`Góðan dag.

        Umsókn þín um að gerast skjalaveita hefur verið samþykkt.
        <a href=${applicationLink} target="_blank">Smelltu hér til þess að halda áfram í útfærslu og prófanir</a>.

        Með kveðju,
        starfsfólk island.is
      `)
      : dedent(`Hello.

        Your application for document providing has been approved.
        <a href=${applicationLink} target="_blank">Click here to implement and test</a>.
        Best regards,
        Island.is
      `)

  return {
    from: {
      name: email.sender,
      address: email.address,
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
