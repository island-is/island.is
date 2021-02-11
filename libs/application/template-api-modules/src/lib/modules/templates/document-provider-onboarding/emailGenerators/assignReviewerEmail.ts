import { dedent } from 'ts-dedent'
import get from 'lodash/get'
import { AssignmentEmailTemplateGenerator } from '../../../../types'

export const generateAssignReviewerEmail: AssignmentEmailTemplateGenerator = (
  props,
  assignLink,
) => {
  const {
    application,
    options: { locale },
  } = props
  const applicantNationalId = get(application.answers, 'applicant.nationalId')
  const applicantName = get(application.answers, 'applicant.name')
  const email = 'gudjonm@advania.is' //TODO change this to island@island.is

  const subject =
    locale === 'is'
      ? 'Yfirferð á umsókn um að gerast skjalaveitandi'
      : 'Request for review on document provider onboarding'
  const body =
    locale === 'is'
      ? dedent(`
      Góðan dag.
      ${applicantName} (kt. ${applicantNationalId}) hefur óskað eftir að gerast skjalaveita í pósthólfinu.
      Umsóknin var framkvæmd af ${application.applicant}.
      Ef þú áttir von á þessum tölvupósti þá getur þú <a href="${assignLink}" target="_blank">smellt hér til þess að fara yfir umsóknina</a>.
      Með kveðju.
      Starfsfólk island.is
    `)
      : dedent(`Hello.

        An application from applicant with national registry ${application.applicant} awaits your approval.

        To review, <a href="${assignLink}">click here</a>.

        Best regards,
        Island.is`)

  return {
    from: {
      name: 'Devland.is',
      address: 'development@island.is',
    },
    to: [
      {
        name: '',
        address: email as string,
      },
    ],
    subject,
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
  }
}
