import { getSlugFromType } from '@island.is/application/core'
import { SendMailOptions } from 'nodemailer'

import { EmailTemplateGeneratorProps } from '../../../../types'
import { DistrictCommissionerLogo } from './consts'

interface ApplicationSubmittedEmail {
  (
    props: EmailTemplateGeneratorProps,
    fileContent: string,
    recipientEmail: string,
    caseNumber?: string,
  ): SendMailOptions
}

export const generateApplicationSubmittedEmail: ApplicationSubmittedEmail = (
  props,
  fileContent,
  recipientEmail,
  caseNumber,
) => {
  const {
    application,
    options: { clientLocationOrigin, email },
  } = props
  const applicationSlug = getSlugFromType(application.typeId) as string
  const applicationLink = `${clientLocationOrigin}/${applicationSlug}/${application.id}`
  const fileName =
    'Samningur um breytt lögheimili barna og meðlag' +
    (caseNumber ? ` nr. ${caseNumber}` : '')
  const caseNumberString = caseNumber
    ? `\nErindið fékk málsnúmerið <strong>${caseNumber}</strong> hjá sýslumanni. Hægt er að vísa í það í frekari samskiptum við fulltrúa sýslumanns.\n`
    : ''
  const subject = 'Afrit af samningi um breytt lögheimili barns'
  const body = `
        <img src=${DistrictCommissionerLogo} height="78" width="246" />


        <h1>${subject}</h1>

        Í viðhengi er afrit af samningi, um breytt lögheimili barna, sem þú undirritaðir.

        Breyting á lögheimili og þar með á greiðslu meðlags og barnabóta tekur gildi eftir að sýslumaður hefur staðfest samninginn.

        Staðfesting sýslumanns verður send í rafræn skjöl á Ísland.is.
        ${caseNumberString}
        Þú getur séð stöðu umsóknarinnar á mínum síðum á Ísland.is.


        <a href=${applicationLink} target="_blank">Opna umsókn</a>.
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
