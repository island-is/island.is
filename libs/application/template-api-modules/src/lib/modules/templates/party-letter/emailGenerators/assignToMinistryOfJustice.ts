import { dedent } from 'ts-dedent'
import { AssignmentEmailTemplateGenerator } from '../../../../types'

export const generateAssignMinistryOfJusticeApplicationEmail: AssignmentEmailTemplateGenerator = (
  props,
  assignLink,
) => {
  const {
    application,
    options: { email },
  } = props

  const ministryOfJusticeEmail =
    process.env.PARTY_LETTER_SUBMISSION_DESTINATION_EMAIL ?? ''

  const subject = 'Meðmæli með listabókstaf'
  const body = dedent(`
        Meðmælendalista um listabókstaf hefur verið skilað inn fyrir:

        <b>Listabókstafur:</b> ${application.answers.partyLetter}
        <b>Stjórnmálasamtök:</b> ${application.answers.partyName}

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
        address: ministryOfJusticeEmail,
      },
    ],
    subject,
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
  }
}
