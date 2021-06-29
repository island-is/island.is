import get from 'lodash/get'
import { dedent } from 'ts-dedent'
import { AssignmentEmailTemplateGenerator } from '../../../../types'

export const generateAssignReviewerEmail: AssignmentEmailTemplateGenerator = (
  props,
  assignLink,
) => {
  const {
    application,
    options: { email, locale },
  } = props
  const applicantNationalId = get(application.answers, 'applicant.nationalId')
  const applicantName = get(application.answers, 'applicant.name')
  const applicantEmail = get(application.answers, 'applicant.email')
  const emailRecipient = process.env.DOCUMENT_PROVIDER_ONBOARDING_REVIEWER

  const subject =
    locale === 'is'
      ? 'Yfirferð á umsókn um að gerast skjalaveitandi'
      : 'Request for review on document provider onboarding'
  const body =
    locale === 'is'
      ? dedent(`
      Góðan dag

      ${applicantName} (kt. ${applicantNationalId}) hefur óskað eftir að gerast skjalaveita í pósthólfinu.
      Umsóknin var framkvæmd af einstaklingi með kt. ${application.applicant}.
      Ef þú áttir von á þessum tölvupósti þá getur þú <a href="${assignLink}" target="_blank">smellt hér til þess að fara yfir umsóknina</a>.
      Netfang umsækjandans er <a href="mailto:${applicantEmail}">${applicantEmail}</a>.

      Með kveðju,
      starfsfólk island.is
    `)
      : dedent(`Hello.

      ${applicantName} (NationalId: ${applicantNationalId}) has requested to be a document provider.
      The application was made by national registry ${application.applicant}.

        To review, <a href="${assignLink}">click here</a>.
        The applicants email is <a href="mailto:${applicantEmail}">${applicantEmail}</a>.

        Best regards,
        Island.is`)

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: '',
        address: emailRecipient as string,
      },
    ],
    subject,
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
  }
}
