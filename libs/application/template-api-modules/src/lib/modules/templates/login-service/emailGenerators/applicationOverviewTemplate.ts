import { Application, getValueViaPath } from '@island.is/application/core'
import { messages } from '@island.is/application/templates/login-service'
import { dedent } from 'ts-dedent'

export const applicationOverviewTemplate = (
  application: Application,
): string => {
  // Applicant
  const applicantName = getValueViaPath(application.answers, 'applicant.name')
  const applicantNationalId = getValueViaPath(
    application.answers,
    'applicant.nationalId',
  )
  const applicanttypeOfOperation = getValueViaPath(
    application.answers,
    'applicant.typeOfOperation',
  )
  const applicantResponsiblePartyName = getValueViaPath(
    application.answers,
    'applicant.responsiblePartyName',
  )
  const applicantResponsiblePartyEmail = getValueViaPath(
    application.answers,
    'applicant.responsiblePartyEmail',
  )
  const applicantResponsiblePartyTel = getValueViaPath(
    application.answers,
    'applicant.responsiblePartyTel',
  )

  // Technical Contact
  const technicalContactName = getValueViaPath(
    application.answers,
    'technicalContact.name',
  )
  const technicalContactEmail = getValueViaPath(
    application.answers,
    'technicalContact.email',
  )
  const technicalContactPhoneNumber = getValueViaPath(
    application.answers,
    'technicalContact.phoneNumber',
  )
  const technicalContactSameAsResponsibleParty = getValueViaPath(
    application.answers,
    'technicalContact.sameAsResponsibleParty',
  )
  const technicalContactTechAnnouncementsEmail = getValueViaPath(
    application.answers,
    'technicalContact.techAnnouncementsEmail',
  )

  // Technical Info
  const technicalInfoType = getValueViaPath(
    application.answers,
    'technicalInfo.type',
  )
  const technicalInfoDevReturnUrl = getValueViaPath(
    application.answers,
    'technicalInfo.devReturnUrl',
  )
  const technicalInfoStagingReturnUrl = getValueViaPath(
    application.answers,
    'technicalInfo.stagingReturnUrl',
  )
  const technicalInfoProdReturnUrl = getValueViaPath(
    application.answers,
    'technicalInfo.prodReturnUrl',
  )
  const technicalInfoClientId = getValueViaPath(
    application.answers,
    'technicalInfo.clientId',
  )

  return dedent(`
    <h3>${messages.applicant.general.pageTitle.defaultMessage}</h3>
    <p>
      <b>${messages.applicant.labels.nameDescription}</b> </br>
      ${applicantName}
    </p>
    <p>
      <b>${messages.applicant.labels.nationalId}</b> </br>
      ${applicantNationalId}
    </p>
    <p>
      <b>${messages.applicant.labels.typeOfOperation}</b> </br>
      ${applicanttypeOfOperation}
    </p>
    <p>
      <b>${messages.applicant.labels.responsiblePartyName}</b> </br>
      ${applicantResponsiblePartyName}
    </p>
    <p>
      <b>${messages.applicant.labels.responsiblePartyEmail}</b> </br>
      ${applicantResponsiblePartyEmail}
    </p>
    <p>
      <b>${messages.applicant.labels.responsiblePartyTel}</b> </br>
      ${applicantResponsiblePartyTel}
    </p>
  `)
}
