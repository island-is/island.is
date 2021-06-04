import { dedent } from 'ts-dedent'
import get from 'lodash/get'

import { EmailTemplateGenerator } from '../../../../types'

export const generateApplicationApprovedByEmployerEmail: EmailTemplateGenerator = (
  props,
) => {
  const {
    application,
    options: { email, locale },
  } = props

  const applicantEmail =
    get(application.answers, 'applicant.email') ||
    get(application.externalData, 'userProfile.data.email')

  // TODO translate using locale
  const subject = 'Umsókn um fæðingarorlof samþykkt af atvinnuveitanda'
  const body = dedent(`Góðan dag.

    Atvinnuveitandi hefur samþykkt umsókn þína og hefur hún nú verið send áfram til úrvinnslu.

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
