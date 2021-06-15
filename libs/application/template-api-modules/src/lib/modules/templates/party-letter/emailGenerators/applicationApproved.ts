import { dedent } from 'ts-dedent'
import get from 'lodash/get'

import { EmailTemplateGenerator } from '../../../../types'

export const generateApplicationApprovedEmail: EmailTemplateGenerator = (
  props,
) => {
  const {
    application,
    options: { email },
  } = props

  const applicantEmail = get(application.answers, 'email')
  const hasComment = application.answers.reasonForReject.toString()?.length

  const subject = 'Umsókn um listabókstaf uppfyllir skilyrði'
  const body = dedent(`
        Umsókn um listabókstaf <strong>uppfyllir skilyrði</strong>. 

        <b>Listabókstafur: </b>${application.answers.partyLetter}
        <b>Stjórnmálasamtök: </b>${application.answers.partyName}

        <b>Athugasemd frá Dómsmálaráðuneytinu: </b>${
          hasComment ? application.answers.reasonForReject : 'Engin athugasemd'
        }
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
