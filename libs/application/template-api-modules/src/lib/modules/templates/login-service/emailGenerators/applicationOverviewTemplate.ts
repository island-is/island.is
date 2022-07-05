import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
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

  // Technical Announcements
  const technicalAnnouncementsEmail = getValueViaPath(
    application.answers,
    'technicalAnnouncements.email',
  )
  const technicalAnnouncementsPhoneNumber = getValueViaPath(
    application.answers,
    'technicalAnnouncements.phoneNumber',
  )
  const technicalAnnouncementsType = getValueViaPath(
    application.answers,
    'technicalAnnouncements.type',
  )

  return dedent(`
    <h3>${messages.terms.general.pageTitle.defaultMessage}</h3>
    <p>
      <b>${
        messages.terms.labels.termsAgreementApprovalForOverview.defaultMessage
      }</b> </br>
      ${messages.terms.labels.yesLabel.defaultMessage}
    </p>
    <h3>${messages.applicant.general.pageTitle.defaultMessage}</h3>
    <p>
      <b>${messages.applicant.labels.nameDescription.defaultMessage}</b> </br>
      ${applicantName}
    </p>
    <p>
      <b>${messages.applicant.labels.nationalId.defaultMessage}</b> </br>
      ${applicantNationalId}
    </p>
    <p>
      <b>${messages.applicant.labels.typeOfOperation.defaultMessage}</b> </br>
      ${applicanttypeOfOperation}
    </p>
    <p>
      <b>${
        messages.applicant.labels.responsiblePartyName.defaultMessage
      }</b> </br>
      ${applicantResponsiblePartyName}
    </p>
    <p>
      <b>${
        messages.applicant.labels.responsiblePartyEmail.defaultMessage
      }</b> </br>
      ${applicantResponsiblePartyEmail}
    </p>
    <p>
      <b>${
        messages.applicant.labels.responsiblePartyTel.defaultMessage
      }</b> </br>
      ${applicantResponsiblePartyTel}
    </p>


    <h3>${messages.technicalAnnouncements.general.pageTitle.defaultMessage}</h3>
    ${
      technicalAnnouncementsEmail
        ? `
          <p>
            <b>${messages.technicalAnnouncements.labels.email.defaultMessage}</b> </br>
            ${technicalAnnouncementsEmail}
          </p>
        `
        : ''
    }
    ${
      technicalAnnouncementsPhoneNumber
        ? `
          <p>
            <b>${messages.technicalAnnouncements.labels.tel.defaultMessage}</b> </br>
            ${technicalAnnouncementsPhoneNumber}
          </p>
        `
        : ''
    }
    <p>
      <b>${messages.technicalAnnouncements.labels.type.defaultMessage}</b> </br>
      ${technicalAnnouncementsType}
    </p>

  `)
}
