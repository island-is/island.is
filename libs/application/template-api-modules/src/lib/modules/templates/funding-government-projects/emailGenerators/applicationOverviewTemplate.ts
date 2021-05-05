import { Application, getValueViaPath } from '@island.is/application/core'
import { messages } from '@island.is/application/templates/institution-collaboration'
import { dedent } from 'ts-dedent'

export const applicationOverviewTemplate = (
  application: Application,
): string => {
  const institutionName = getValueViaPath(
    application.answers,
    'applicant.institution',
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

  const projectName = getValueViaPath(application.answers, 'project.name')

  const projectDescription = getValueViaPath(
    application.answers,
    'project.description',
  )

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
  <p>
    <b>${messages.project.nameLabel.defaultMessage}</b> </br>
    ${projectName}
  </p>
  <p>
    <b>${messages.project.backgroundLabel.defaultMessage}</b> </br>
    ${projectDescription}
  </p>

  `)
}
