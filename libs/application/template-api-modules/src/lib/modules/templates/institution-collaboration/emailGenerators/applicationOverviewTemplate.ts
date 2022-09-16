import { Application } from '@island.is/application/types'
import { dedent } from 'ts-dedent'
import { getValueViaPath } from '@island.is/application/core'
import { messages } from '@island.is/application/templates/institution-collaboration'

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

  const certConstraints = getValueViaPath(
    application.answers,
    'constraints.hasCert',
  ) as boolean

  const consultConstraints = getValueViaPath(
    application.answers,
    'constraints.hasConsult',
  ) as boolean

  const hasConstraints = [
    mailConstraints,
    loginConstraints,
    straumurConstraints,
    websiteConstraints,
    applyConstraints,
    myPageConstraints,
    certConstraints,
    consultConstraints,
  ].some((x) => !!x)

  return dedent(`

  <h3>${messages.applicant.sectionLabel.defaultMessage}</h3>
  <p>
    <b>${messages.applicant.institutionLabel.defaultMessage}</b> </br>
    ${institutionName}
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


  <h3>${messages.project.sectionTitle.defaultMessage}</h3>

  ${
    hasConstraints
      ? `<h3>${messages.constraints.sectionTitle.defaultMessage}</h3>`
      : ''
  }

  ${
    mailConstraints
      ? `<p>
  <b>${messages.constraints.constraintsMailLabel.defaultMessage}</b> </br>
  ${mailConstraints}
  </p>`
      : ''
  }

  ${
    loginConstraints
      ? `<p>
  <b>${messages.constraints.constraintsLoginLabel.defaultMessage}</b> </br>
  ${loginConstraints}
  </p>`
      : ''
  }


  ${
    straumurConstraints
      ? `<p>
  <b>${messages.constraints.constraintsStraumurLabel.defaultMessage}</b> </br>
  ${straumurConstraints}
  </p>`
      : ''
  }

  ${
    websiteConstraints
      ? `<p>
  <b>${messages.constraints.constraintsWebsiteLabel.defaultMessage}</b> </br>
  ${websiteConstraints}
  </p>`
      : ''
  }

  ${
    applyConstraints
      ? `<p>
  <b>${messages.constraints.constraintsApplyingLabel.defaultMessage}</b> </br>
  ${applyConstraints}
  </p>`
      : ''
  }

  ${
    myPageConstraints
      ? `<p>
  <b>${messages.constraints.constraintsmyPagesLabel.defaultMessage}</b> </br>
  ${myPageConstraints}
  </p>`
      : ''
  }
  `)
}
