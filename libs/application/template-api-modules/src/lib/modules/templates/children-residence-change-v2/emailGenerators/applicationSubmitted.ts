import { getSlugFromType } from '@island.is/application/core'
import { SendMailOptions } from 'nodemailer'

import { EmailTemplateGeneratorProps } from '../../../../types'
import {
  DistrictCommissionerLogo,
  fontStyles,
  ulStyles,
  liStyles,
} from './consts'

interface ApplicationSubmittedEmail {
  (
    props: EmailTemplateGeneratorProps,
    fileContent: string,
    recipientEmail: string,
    syslumennName: string,
    caseNumber?: string,
  ): SendMailOptions
}

export const generateApplicationSubmittedEmail: ApplicationSubmittedEmail = (
  props,
  fileContent,
  recipientEmail,
  syslumennName,
  caseNumber,
) => {
  const {
    application,
    options: { clientLocationOrigin, email },
  } = props
  const applicationSlug = getSlugFromType(application.typeId) as string
  const applicationLink = `${clientLocationOrigin}/${applicationSlug}/${application.id}`

  const fileName =
    'Samningur um breytt lögheimili barns' +
    (caseNumber ? ` nr. ${caseNumber}` : '')
  const caseNumberString = caseNumber
    ? `<li style=${liStyles}><strong>${syslumennName}</strong> hefur nú móttekið erindið sem fékk málsnúmerið <strong>${caseNumber}</strong>. Hægt er að vísa í það í frekari samskiptum við fulltrúa sýslumanns.</li>`
    : ''
  const subject = 'Samningur um breytt lögheimili barns'
  const body = `
        <img src=${DistrictCommissionerLogo} height="78" width="246" />


        <h1 style="margin-bottom: 0;">${subject} undirritaður af báðum foreldrum</h1>
        <p style="${fontStyles} margin: 20px 0;">Báðir foreldrar hafa undirritað samning um breytt lögheimili. Í viðhengi er afrit af undirrituðum samning.</p>
        <strong style="${fontStyles} display: block; margin-bottom: 8px;">Næstu skref </strong><ul style="${ulStyles}"><li style=${liStyles}>Umsóknin fer nú til meðferðar hjá sýslumanni. Ef sýslumaður telur þörf á frekari upplýsingum mun hann hafa samband. Meðferð sýslumanns getur tekið tvær vikur.</li><li style=${liStyles}>Ef sýslumaður staðfestir breytinguna fáið þið staðfestingu senda í pósthólf á Island.is. Sýslumaður mun síðan tilkynna Þjóðskrá Íslands um lögheimilisbreytingu ef við á.</li>${caseNumberString}</ul>

        <a style="${fontStyles}" href=${applicationLink} target="_blank">Opna samning</a>.
      `

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: '',
        address: recipientEmail,
      },
    ],
    subject,
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
    attachments: [
      {
        filename: `${fileName}.pdf`,
        content: fileContent,
        encoding: 'binary',
      },
    ],
  }
}
