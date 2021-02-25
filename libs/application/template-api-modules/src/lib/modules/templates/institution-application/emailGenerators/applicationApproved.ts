import { dedent } from 'ts-dedent'
import get from 'lodash/get'

import { EmailTemplateGenerator } from '../../../../types'
import { m } from '@island.is/application/templates/institution-application'

export const generateApplicationEmail: EmailTemplateGenerator = (
  props,
) => {
  const {
    application,
    options: { locale },
  } = props

  const institutionApplicant = get(application.answers, 'applicant.institution')
  const applicantEmail = get(application.answers, 'contact.email')
  const applicantName = get(application.answers, 'contact.name')
  const applicantPhone = get(application.answers, 'contact.phoneNumber')

  const projectName = get(application.answers, 'project.name')
  const projectGoal = get(application.answers, 'project.goals')
  const projectScope = get(application.answers, 'project.scope')
  const projectFinance = get(application.answers, 'project.finance')
  const projectBackground = get(application.answers, 'project.background')

  console.log(application.answers)
  console.log('applicant Email', applicantEmail)
  // TODO translate using locale
  const subject =
    locale === 'is'
      ? 'Umsókn samþykkt: ReferenceTemplate'
      : 'Application approved: Reference Template'

  const secondaryContact = ``

  const body =
    dedent(`
        Umsókn hefur send verið inn frá ${institutionApplicant}.

        # Nafn ${applicantName}
        # Tölvupóstfang ${applicantEmail}
        # Sími ${applicantPhone}

        Nafn verkefnis:
        ${projectName}

        Bakgrunnur verkefnis:
        ${projectBackground}

        Markmið verkefnis ávinningur og markhópur

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
