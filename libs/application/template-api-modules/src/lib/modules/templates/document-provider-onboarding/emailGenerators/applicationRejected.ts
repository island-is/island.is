import { dedent } from 'ts-dedent'
import get from 'lodash/get'

import { EmailTemplateGenerator } from '../../../../types'

export const generateApplicationRejectedEmail: EmailTemplateGenerator = (
  props,
) => {
  const {
    application,
    options: { email, locale },
  } = props

  const applicantEmail = get(application.answers, 'applicant.email')

  // TODO translate using locale
  const subject = locale === 'is' ? 'Umsókn hafnað' : 'Application rejected'
  const body =
    locale === 'is'
      ? dedent(`Góðan dag.

        Umsókn þinni um að gerast skjalaveita hefur verið hafnað.
        Ástæða höfnunar: ${get(application.answers, 'rejectionReason')}

        Með kveðju,
        starfsfólk island.is
      `)
      : dedent(`Hello.

        Your application for document providing has been rejected.

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
