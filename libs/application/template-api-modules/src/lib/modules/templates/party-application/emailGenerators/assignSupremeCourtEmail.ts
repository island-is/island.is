import { dedent } from 'ts-dedent'
import { AssignmentEmailTemplateGenerator } from '../../../../types'

export const generateAssignSupremeCourtApplicationEmail: AssignmentEmailTemplateGenerator = (
  props,
  assignLink,
) => {
  const {
    application,
    options: { email },
  } = props

  const supremeCourtEmail =
    process.env.PARTY_APPLICATION_SUBMISSION_DESTINATION_EMAIL ?? ''
  const { partyLetter, partyName } = application.externalData
    .partyLetterRegistry?.data as any

  const subject = 'Meðmæli með framboðslista'
  const body = dedent(`
        Meðmæli með framboðslista hefur verið skilað inn fyrir:

        <b>Stjórnmálasamtök:</b> ${partyName}
        <b>Listabókstafur:</b> ${partyLetter}
        <b>Kjördæmi:</b> ${application.answers.constituency}

        Ef þú áttir von á þessum tölvupósti þá getur þú <a href="${assignLink}" target="_blank">smellt hér til þess að fara yfir umsóknina</a>.
        `)

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: '',
        address: supremeCourtEmail,
      },
    ],
    subject,
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
  }
}
