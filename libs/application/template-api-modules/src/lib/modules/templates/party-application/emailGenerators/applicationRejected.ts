import { dedent } from 'ts-dedent'
import get from 'lodash/get'
import { getSlugFromType } from '@island.is/application/core'

import { EmailTemplateGenerator } from '../../../../types'

export const generateApplicationRejectedEmail: EmailTemplateGenerator = (
  props,
) => {
  const {
    application,
    options: { email, clientLocationOrigin },
  } = props

  const applicantEmail = get(
    application.answers,
    'responsiblePersonEmail',
  )
  const applicationSlug = getSlugFromType(application.typeId) as string
  const applicationLink = `${clientLocationOrigin}/${applicationSlug}/${application.id}`

  const subject = 'Meðmæli með framboðslista uppfylla ekki skilyrði'
  const body = dedent(`
        Meðmæli með framboðslista <strong>uppfyllir ekki skilyrði</strong> yfirkjörstjórnar. 

        <b>Stjórnmálasamtök: </b>${application.answers.partyName}
        <b>Listabókstafur: </b>${application.answers.partyLetter}
        <b>Kjördæmi: </b>${application.answers.constituency}

        <b>Athugasemd frá yfirkjörstjórn: </b>${application.answers.reasonForReject ?? 'Engin athugasemd'}

        Þú getur <a href="${applicationLink}" target="_blank">smellt hér til þess að fara yfir umsóknina</a>.
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
