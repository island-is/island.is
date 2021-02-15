import { dedent } from 'ts-dedent'
import get from 'lodash/get'

import { EmailTemplateGenerator } from '../../../../types'

export const generateApplicationRejectedEmail: EmailTemplateGenerator = (
  props,
) => {
  const {
    application,
    options: { locale },
  } = props

  const applicantEmail = get(application.answers, 'applicant.email')

  // TODO translate using locale
  const subject =
    locale === 'is'
      ? 'Umsókn samþykkt: ReferenceTemplate'
      : 'Application approved: Reference Template'
  const body =
    locale === 'is'
      ? dedent(`Góðan dag.

        Umsókn þín um að gerast skajalveita hefur verið hafnað.
        Ástæða höfnunar: ${get(application.answers, 'rejectionReason')}

        Með kveðju,
        starfsfólk Island.is
      `)
      : dedent(`Hello.

        Your application for document providing has been rejected.

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
