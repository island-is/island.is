import { AttachmentEmailTemplateGenerator } from '../../../../types'

export const generateSyslumennNotificationEmail: AttachmentEmailTemplateGenerator =
  (props, fileContent, recipientEmail) => {
    const {
      application,
      options: { email },
    } = props
    const subject = 'Samningur um breytt lögheimili barns'
    const body = `
  Berist til fjölskyldusviðs (sifjamál)

  Í viðhengi er samningur frá Island.is milli tveggja foreldra um breytt lögheimili barns/barna og meðlag.

  Undir venjulegum kringumstæðum er samningurinn vistaður og mál stofnað sjálfkrafa í Starfskerfi en vegna tæknilegra vandamála tókst það ekki fyrir þennan samning.

  Stofna þarf mál í Starfskerfi og vista samninginn þar. Búið er að staðfesta núverandi forsjá og lögheimili með uppflettingu í þjóðskrá og málið er tilbúið til afgreiðslu.
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
          filename: `${application.id}.pdf`,
          content: fileContent,
          encoding: 'binary',
        },
      ],
    }
  }
