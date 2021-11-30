import { AttachmentEmailTemplateGenerator } from '../../../../types'

export const generateSyslumennNotificationEmail: AttachmentEmailTemplateGenerator = (
  props,
  fileContent,
  recipientEmail,
) => {
  const {
    application,
    options: { email },
  } = props
  const subject = 'Umsókn um sakavottorð' //TODO-origo
  const body = `
  Berist til XX

  Í viðhengi er rafrænt sakavottorð frá Island.is fyrir einstakling.

  Undir venjulegum kringumstæðum er sakavottorðið sjálfkrafa sent í pósthólf einstaklings í gegnum vefþjónustu Sýslumanns en vegna tæknilegra vandamála tókst það ekki fyrir þetta vottorð.

  Það þarf að gera hitt og þetta við sakavottorðið. Búið er að annað og fleira við sakavottorðið.
      ` //TODO-origo

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
