import { dedent } from 'ts-dedent'
import get from 'lodash/get'

import { AssignmentEmailTemplateGenerator } from '../../../../types'

export const generateAssignApplicationEmail: AssignmentEmailTemplateGenerator = (
  props,
  assignLink,
) => {
  const {
    application,
    options: { locale },
  } = props

  const applicantEmail = get(application.answers, 'person.email')

  // TODO translate using locale
  const subject =
    locale === 'is'
      ? 'Beiðni um staðfestingu á umsókn: ReferenceTemplate'
      : 'Request for review: ReferenceTemplate'
  const body =
    locale === 'is'
      ? dedent(`Góðan dag.

        Umsókn umsækjanda með kennitölu ${application.applicant} bíður yfirferðar.

        Til þess að fara yfir umsókn <a href="${assignLink}">smelltu hér</a>.

        Með kveðju,
        starfsfólk ReferenceTemplateStofnunarinnar
      `)
      : dedent(`Hello.

        An application from applicant with national registry ${application.applicant} awaits your approval.

        To review, <a href="${assignLink}">click here</a>.

        Best regards,
        ReferenceTemplateInstitution
      `)

  return {
    from: {
      name: 'Devland.is',
      address: 'development@island.is',
    },
    to: [
      {
        name: '',
        address: applicantEmail as string,
      },
    ],
    subject,
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
  }
}
