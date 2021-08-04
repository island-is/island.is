import { Application } from '@island.is/application/core'
import {
  messages,
  AccidentNotificationAnswers,
  WhoIsTheNotificationForEnum,
} from '@island.is/application/templates/accident-notification'
import { dedent } from 'ts-dedent'

const isReportingOnBehalfOfInjured = (answers: AccidentNotificationAnswers) => {
  const reportingOnBehalf = answers.whoIsTheNotificationFor.answer

  return (
    reportingOnBehalf === WhoIsTheNotificationForEnum.JURIDICALPERSON ||
    reportingOnBehalf === WhoIsTheNotificationForEnum.POWEROFATTORNEY
  )
}

const getInjuredPersonInformation = (answers: AccidentNotificationAnswers) => `
<p>
  <b>${messages.injuredPersonInformation.labels.name}</b> 
  ${answers.injuredPersonInformation.name}
</p>
<p>
  <b>${messages.injuredPersonInformation.labels.nationalId}</b> 
  ${answers.injuredPersonInformation.nationalId}
</p>
<p>
  <b>${messages.injuredPersonInformation.labels.email}</b> 
  ${answers.injuredPersonInformation.email}
</p>
<p>
  <b>${messages.injuredPersonInformation.labels.tel}</b> 
  ${answers.injuredPersonInformation.phoneNumber}
</p> </br>
`

const getApplicantInformation = (answers: AccidentNotificationAnswers) => `
<p>
  <b>${messages.applicantInformation.labels.name}</b> 
  ${answers.applicant.name}
</p>
<p>
  <b>${messages.applicantInformation.labels.nationalId}</b> 
  ${answers.applicant.nationalId}
</p>
<p>
  <b>${messages.applicantInformation.labels.address}</b> 
  ${answers.applicant.address}
</p>
<p>
  <b>${messages.applicantInformation.labels.city}</b> 
  ${answers.applicant.city}
</p>
<p>
  <b>${messages.applicantInformation.labels.email}</b> 
  ${answers.applicant.email}
</p>
<p>
  <b>${messages.applicantInformation.labels.tel}</b> 
  ${answers.applicant.phoneNumber}
</p> </br>
`

export const overviewTemplate = (application: Application): string => {
  const answers = application.answers as AccidentNotificationAnswers

  // TODO finish this
  return dedent(`
    <h2>Yfirlit tilkynningar</h2> </br>
    <h3>${messages.injuredPersonInformation.general.heading.defaultMessage}</h3>
    ${
      isReportingOnBehalfOfInjured(answers)
        ? getInjuredPersonInformation(answers)
        : getApplicantInformation(answers)
    }
  `)
}
