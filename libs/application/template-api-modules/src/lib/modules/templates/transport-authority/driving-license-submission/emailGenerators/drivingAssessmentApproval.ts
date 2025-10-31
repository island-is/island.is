import { dedent } from 'ts-dedent'
import get from 'lodash/get'

import { EmailTemplateGenerator } from '../../../../../types'

export const generateDrivingAssessmentApprovalEmail: EmailTemplateGenerator = (
  props,
) => {
  const {
    application,
    options: { email, locale },
  } = props

  const studentEmail = get(application.answers, 'student.email')

  // TODO translate using locale
  const subject =
    locale === 'is'
      ? 'Staðfesting akstursmats'
      : 'Driving assessment confirmation'
  const html =
    locale === 'is'
      ? dedent(`<h1>Akstursmat lokið</h1>

        <p>Ökukennarinn þinn hefur staðfest að akstursmat hafi farið fram.
        Smelltu hér til að hefja umsókn um fullnaðarskírteini</p>

        <p><a href="https://island.is/umsoknir/okuskirteini/">Hefja umsókn</a></p>
      `)
      : dedent(`<h1>Driving assessment confirmed</h1>

        <p>Your teacher has confirmed that the driving assessment has taken place.
        Click here to start your application</p>

        <p><a href="https://island.is/umsoknir/okuskirteini">Start application</a></p>
      `)

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: '',
        address: studentEmail as string,
      },
    ],
    subject,
    html: html,
  }
}
