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

  const applicantEmail = get(application.answers, 'responsiblePersonEmail')
  const { partyLetter, partyName } = application.externalData
    .partyLetterRegistry?.data as any

  const subject = 'Meðmæli með framboðslista uppfyllir skilyrði'
  const body = dedent(`
        Meðmæli með framboðslista <strong>uppfyllir skilyrði</strong> yfirkjörstjórnar. 

        <b>Stjórnmálasamtök: </b>${partyName}
        <b>Listabókstafur: </b>${partyLetter}
        <b>Kjördæmi: </b>${application.answers.constituency}

        <b>Athugasemd frá yfirkjörstjórn: </b>${
          application.answers.reasonForReject ?? 'Engin athugasemd'
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
