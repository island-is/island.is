import { Application } from '@island.is/application/types'
import { dedent } from 'ts-dedent'
import { getValueViaPath } from '@island.is/application/core'
import { messages } from '@island.is/application/templates/institution-collaboration'

export function getServiceText(title: string, service: string, value: string) {
  return `<p>
  <b>${title} - ${service}</b> </br>
  ${value}
  </p>`
}

export const applicationOverviewTemplate = (
  application: Application,
): string => {
  const institutionName = getValueViaPath(
    application.answers,
    'applicant.institution.label',
  )

  const institutionEmail = getValueViaPath(
    application.answers,
    'applicant.institutionEmail',
  )

  const contactName = getValueViaPath(application.answers, 'contact.name')
  const contactEmail = getValueViaPath(application.answers, 'contact.email')
  const contactPhone = getValueViaPath(
    application.answers,
    'contact.phoneNumber',
  )

  const secondaryContactName = getValueViaPath(
    application.answers,
    'secondaryContact.name',
  )
  const secondaryContactEmail = getValueViaPath(
    application.answers,
    'secondaryContact.email',
  )
  const secondaryContactPhone = getValueViaPath(
    application.answers,
    'secondaryContact.phoneNumber',
  )
  const hasSecondaryContact = [
    secondaryContactName,
    secondaryContactEmail,
    secondaryContactPhone,
  ].some((x) => !!x)

  const mailConstraints = getValueViaPath(
    application.answers,
    'constraints.hasMail',
  ) as boolean

  const loginConstraints = getValueViaPath(
    application.answers,
    'constraints.hasLogin',
  ) as boolean

  const straumurConstraints = getValueViaPath(
    application.answers,
    'constraints.hasStraumur',
  ) as boolean

  const websiteConstraints = getValueViaPath(
    application.answers,
    'constraints.hasWebsite',
  ) as boolean

  const applyConstraints = getValueViaPath(
    application.answers,
    'constraints.hasApply',
  ) as boolean

  const myPageConstraints = getValueViaPath(
    application.answers,
    'constraints.hasMyPages',
  ) as boolean

  const certConstraint = getValueViaPath(
    application.answers,
    'constraints.hasCert',
  ) as boolean

  const consultContraint = getValueViaPath(
    application.answers,
    'constraints.hasConsult',
  ) as boolean

  const applyConstraintsText = getValueViaPath(
    application.answers,
    'constraints.apply',
  ) as string

  const myPagesConstraintsText = getValueViaPath(
    application.answers,
    'constraints.myPages',
  ) as string

  const certConstraintsText = getValueViaPath(
    application.answers,
    'constraints.cert',
  ) as string

  const consultConstraintsText = getValueViaPath(
    application.answers,
    'constraints.consult',
  ) as string

  const hasConstraints = [
    mailConstraints,
    loginConstraints,
    straumurConstraints,
    websiteConstraints,
    applyConstraints,
    myPageConstraints,
    certConstraint,
    consultContraint,
  ].some((x) => !!x)

  //  #region Services Text
  const servicesTextArr: string[] = []
  mailConstraints &&
    servicesTextArr.push(
      messages.constraints.constraintsMailLabel.defaultMessage,
    )
  loginConstraints &&
    servicesTextArr.push(
      messages.constraints.constraintsLoginLabel.defaultMessage,
    )
  straumurConstraints &&
    servicesTextArr.push(
      messages.constraints.constraintsStraumurLabel.defaultMessage,
    )
  websiteConstraints &&
    servicesTextArr.push(
      messages.constraints.constraintsWebsiteLabel.defaultMessage,
    )
  applyConstraints &&
    servicesTextArr.push(
      messages.constraints.constraintsApplyingLabel.defaultMessage,
    )
  myPageConstraints &&
    servicesTextArr.push(
      messages.constraints.constraintsmyPagesLabel.defaultMessage,
    )
  certConstraint &&
    servicesTextArr.push(
      messages.constraints.constraintsCertLabel.defaultMessage,
    )
  consultContraint &&
    servicesTextArr.push(
      messages.constraints.constraintsConsultLabel.defaultMessage,
    )

  function getServicesTextOutput(): string {
    let text = ''
    for (let i = 0; i < servicesTextArr?.length; i++) {
      text += servicesTextArr[i]
      if (i !== servicesTextArr.length - 1) {
        text += ', '
      }
    }
    return text
  }

  //#endregion Services Text

  return dedent(`

  <h3>${messages.applicant.sectionLabel.defaultMessage}</h3>
  <p>
    <b>${messages.applicant.institutionLabel.defaultMessage}</b> </br>
    ${institutionName}


  </p>
  <p>
    <b>${
      messages.applicant.contactInstitutionEmailLabel.defaultMessage
    }</b> </br>
    ${institutionEmail}


  </p>
  <h3>${messages.applicant.contactSubtitle.defaultMessage}</h3>
  <p>
    <b>${messages.applicant.contactNameLabel.defaultMessage}</b> </br>
    ${contactName}
  </p>
  <p>
    <b>${messages.applicant.contactEmailLabel.defaultMessage}</b> </br>
    ${contactEmail}
  </p>
  <p>
    <b>${messages.applicant.contactPhoneLabel.defaultMessage}</b> </br>
    ${contactPhone}
  </p>

  ${
    hasSecondaryContact
      ? `<h3>${messages.applicant.secondaryContactSubtitle.defaultMessage}</h3> `
      : ''
  }

  ${
    secondaryContactName
      ? `<p>
  <b>${messages.applicant.contactNameLabel.defaultMessage}</b> </br>
  ${secondaryContactName}
  </p>`
      : ''
  }

  ${
    secondaryContactEmail
      ? `<p>
  <b>${messages.applicant.contactEmailLabel.defaultMessage}</b> </br>
  ${secondaryContactEmail}
  </p>`
      : ''
  }

  ${
    secondaryContactPhone
      ? `<p>
  <b>${messages.applicant.contactPhoneLabel.defaultMessage}</b> </br>
  ${secondaryContactPhone}
  </p>`
      : ''
  }

  ${
    hasConstraints
      ? `<p><b>${messages.constraints.sectionTitle.defaultMessage}</b> </br>
        ${getServicesTextOutput()}</p>`
      : ''
  }



  ${
    applyConstraints
      ? getServiceText(
          messages.constraints.constraintsApplyingPlaceholder.defaultMessage,
          messages.constraints.constraintsApplyingLabel.defaultMessage,
          applyConstraintsText,
        )
      : ''
  }

  ${
    myPageConstraints
      ? getServiceText(
          messages.constraints.constraintsmyPagesPlaceholder.defaultMessage,
          messages.constraints.constraintsmyPagesLabel.defaultMessage,
          myPagesConstraintsText,
        )
      : ''
  }

  ${
    certConstraint
      ? getServiceText(
          messages.constraints.constraintsCertPlaceholder.defaultMessage,
          messages.constraints.constraintsCertLabel.defaultMessage,
          certConstraintsText,
        )
      : ''
  }

  ${
    consultContraint
      ? getServiceText(
          messages.constraints.constraintsConsultPlaceholder.defaultMessage,
          messages.constraints.constraintsConsultLabel.defaultMessage,
          consultConstraintsText,
        )
      : ''
  }


  `)
}
