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


    <h3>${messages.technicalContact.general.pageTitle.defaultMessage}</h3>
    ${
      technicalContactName
        ? `
          <p>
            <b>${messages.technicalContact.labels.name.defaultMessage}</b> </br>
            ${technicalContactName}
          </p>
        `
        : ''
    }
    ${
      technicalContactEmail
        ? `
          <p>
            <b>${messages.technicalContact.labels.email.defaultMessage}</b> </br>
            ${technicalContactEmail}
          </p>
        `
        : ''
    }
    ${
      technicalContactPhoneNumber
        ? `
          <p>
            <b>${messages.technicalContact.labels.tel.defaultMessage}</b> </br>
            ${technicalContactPhoneNumber}
          </p>
        `
        : ''
    }
    ${
      (technicalContactSameAsResponsibleParty as
        | string[]
        | undefined)?.includes('yes')
        ? `
          <p>
            ${messages.technicalContact.labels.sameAsResponsibleParty.defaultMessage}
          </p>
        `
        : ''
    }
    <p>
      <b>${
        messages.technicalContact.labels.techAnnouncementsEmail.defaultMessage
      }</b> </br>
      ${technicalContactTechAnnouncementsEmail}
    </p>


    <h3>${messages.technicalInfo.general.pageTitle.defaultMessage}</h3>
    <p>
      <b>${messages.technicalInfo.labels.type.defaultMessage}</b> </br>
      ${technicalInfoType}
    </p>
    ${
      technicalInfoDevReturnUrl
        ? `
          <p>
            <b>${messages.technicalInfo.labels.devReturnUrl.defaultMessage}</b> </br>
            ${technicalInfoDevReturnUrl}
          </p>
        `
        : ''
    }
    ${
      technicalInfoStagingReturnUrl
        ? `
          <p>
            <b>${messages.technicalInfo.labels.stagingReturnUrl.defaultMessage}</b> </br>
            ${technicalInfoStagingReturnUrl}
          </p>
        `
        : ''
    }
    <p>
      <b>${messages.technicalInfo.labels.prodReturnUrl.defaultMessage}</b> </br>
      ${technicalInfoProdReturnUrl}
    </p>
    ${
      technicalInfoClientId
        ? `
          <p>
            <b>${messages.technicalInfo.labels.clientId.defaultMessage}</b> </br>
            ${technicalInfoClientId}
          </p>
        `
        : ''
    }
  `)
}
