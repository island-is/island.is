import { dedent } from 'ts-dedent'
import get from 'lodash/get'

import { EmailTemplateGenerator } from '../../../../types'

export const generateApplicationApprovedEmail: EmailTemplateGenerator = (
  props,
) => {
  const {
    application,
    options: { email, locale },
  } = props

  const applicantEmail = get(application.answers, 'person.email')

  // TODO translate using locale
  const subject =
    locale === 'is'
      ? 'Umsókn samþykkt: ReferenceTemplate'
      : 'Application approved: Reference Template'
  const body =
    locale === 'is'
      ? dedent(`Góðan dag.

        Umsókn þín um ReferenceTemplate hefur verið samþykkt.

        Með kveðju,
        starfsfólk ReferenceTemplateStofnunarinnar
      `)
      : dedent(`Hello.

        Your application for ReferenceTemplate has been approved.

        Best regards,
        ReferenceTemplateInstitution
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
