import { AttachmentEmailTemplateGenerator } from '../../../../types'

export const generateApplicationSubmittedEmail: AttachmentEmailTemplateGenerator = (
  props,
  fileContent,
  email,
) => {
  const {
    application,
    options: { clientLocationOrigin },
  } = props
  const applicationLink = `${clientLocationOrigin}/umsokn/${application.id}`

  const subject = 'Afrit af samning'
  const body = `
        Í viðhengi er afrit af undirrituðum samning um breytt lögheimili barns.

        Breyting á lögheimili og þar með á greiðslu meðlags og barnabóta tekur gildi eftir að sýslumaður hefur staðfest samninginn.

        Staðfesting sýslumanns verður send í rafræn skjöl á Ísland.is.

        Þú getur séð stöðu umsóknarinnar á mínum síðum á Ísland.is

        <a href=${applicationLink} target="_blank">Fara á mínar síður</a>.
      `

  return {
    from: {
      name: 'Devland.is',
      address: 'development@island.is',
    },
    to: [
      {
        name: '',
        address: email,
      },
    ],
    subject,
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
    attachments: [
      {
        filename: `${application.id}.pdf`,
        content: fileContent,
        encoding: 'binary',
      },
    ],
  }
}
