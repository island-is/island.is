import { dedent } from 'ts-dedent'
import { AssignmentEmailTemplateGenerator } from '../../../../types'

export const generateAssignSupremeCourtApplicationEmail: AssignmentEmailTemplateGenerator = (
  props,
  assignLink,
) => {
  const {
    application,
    options: { email, locale },
  } = props

  const supremeCourtEmail = 'sigridur@kosmosogkaos.is'
  const applicant = '000000-0000'

  // TODO translate using locale
  const subject =
    locale === 'is'
      ? 'Yfirferð á umsókn um framboð í kjördæmi'
      : 'Request for review party application in constituency'
  const body =
    locale === 'is'
      ? dedent(`Góðan dag.

        Umsækjandi með kennitölu ${applicant} hefur sent inn umsókn með meðmælum í ${application.answers.constituency}

        Ef þú áttir von á þessum tölvupósti þá getur þú <a href="${assignLink}" target="_blank">smellt hér til þess að fara yfir umsóknina</a>.

        Með kveðju,
        Dómsmálaráðuneytið`)
      : dedent(`Hello.

        An application from applicant with national registry ${applicant} awaits your approval.

        To review, <a href="${assignLink}">click here</a>.

        Best regards,
        DMR`)

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: '',
        address: supremeCourtEmail as string,
      },
    ],
    subject,
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
  }
}
