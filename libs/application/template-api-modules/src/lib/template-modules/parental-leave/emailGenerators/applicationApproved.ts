import { dedent } from 'ts-dedent'
import get from 'lodash/get'

import { EmailTemplateGenerator } from '../../../types'

export const generateApplicationApprovedEmail: EmailTemplateGenerator = (
  props,
) => {
  const {
    application,
    options: { locale },
  } = props

  const applicantEmail = get(application.answers, 'person.email')

  // TODO translate using locale
  const subject =
    locale === 'is'
      ? 'Umsókn um fæðingarorlof samþykkt'
      : 'Paternity leave application approved'
  const body =
    locale === 'is'
      ? dedent(`Góðan dag.

        Umsókn þín um fæðingarorlof hefur verið samþykkt.

        Með kveðju,
        Fæðingarorlofssjóðsjóður
      `)
      : dedent(`Hello.

        Your application for paternity leave has been approved.

        Best regards,
        Fæðingarorlofssjóðsjóður
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
