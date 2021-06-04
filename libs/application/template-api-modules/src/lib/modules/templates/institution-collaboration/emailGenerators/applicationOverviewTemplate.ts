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
  const projectGoal = getValueViaPath(application.answers, 'project.goals')
  const projectScope = getValueViaPath(application.answers, 'project.scope')
  const projectFinance = getValueViaPath(application.answers, 'project.finance')
  const projectBackground = getValueViaPath(
    application.answers,
    'project.background',
  )
  const projectStakeholders = getValueViaPath(
    application.answers,
    'stakeholders',
  )
  const projectRole = getValueViaPath(application.answers, 'role')
  const projectOtherRoles = getValueViaPath(application.answers, 'otherRoles')

  const technicalConstraints = getValueViaPath(
    application.answers,
    'constraints.technical',
  ) as boolean
  const financialConstraints = getValueViaPath(
    application.answers,
    'constraints.financial',
  ) as boolean
  const timeConstraints = getValueViaPath(
    application.answers,
    'constraints.time',
  ) as boolean

  const moralConstraints = getValueViaPath(
    application.answers,
    'constraints.moral',
  ) as boolean
  const otherConstraints = getValueViaPath(
    application.answers,
    'constraints.other',
  ) as boolean

  const hasConstraints = [
    technicalConstraints,
    financialConstraints,
    timeConstraints,
    moralConstraints,
    otherConstraints,
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
  <p>
    <b>${messages.project.nameLabel.defaultMessage}</b> </br>
    ${projectName}
  </p>
  <p>
    <b>${messages.project.backgroundLabel.defaultMessage}</b> </br>
    ${projectBackground}
  </p>
  <p>
    <b>${messages.project.goalsLabel.defaultMessage}</b> </br>
    ${projectGoal}
  </p>
  <p>
    <b>${messages.project.scopeLabel.defaultMessage}</b> </br>
    ${projectScope}
  </p>
  <p>
    <b>${messages.project.financeLabel.defaultMessage}</b> </br>
    ${projectFinance}
  </p>


  ${
    hasConstraints
      ? `<h3>${messages.constraints.sectionTitle.defaultMessage}</h3>`
      : ''
  }

  ${
    technicalConstraints
      ? `<p>
  <b>${messages.constraints.constraintsTechicalLabel.defaultMessage}</b> </br>
  ${technicalConstraints}
  </p>`
      : ''
  }

  ${
    financialConstraints
      ? `<p>
  <b>${messages.constraints.constraintsFinancialLabel.defaultMessage}</b> </br>
  ${financialConstraints}
  </p>`
      : ''
  }

  
  ${
    moralConstraints
      ? `<p>
  <b>${messages.constraints.constraintsMoralLabel.defaultMessage}</b> </br>
  ${moralConstraints}
  </p>`
      : ''
  }

  ${
    timeConstraints
      ? `<p>
  <b>${messages.constraints.constraintsTimeLabel.defaultMessage}</b> </br>
  ${timeConstraints}
  </p>`
      : ''
  }

  ${
    otherConstraints
      ? `<p>
  <b>${messages.constraints.constraintsOtherLabel.defaultMessage}</b> </br>
  ${otherConstraints}
  </p>`
      : ''
  }

  
  <h3>${messages.stakeholders.sectionTitle.defaultMessage}</h3>
  <p>
    <b>${messages.stakeholders.stakeholdersLabel.defaultMessage}</b> </br>
    ${projectStakeholders}
  </p>
  <p>
    <b>${messages.stakeholders.roleLabel.defaultMessage}</b> </br>
    ${projectRole}
  </p>
  <p>
    <b>${messages.stakeholders.otherRolesLabel.defaultMessage}</b> </br>
    ${projectOtherRoles}
  </p>

  `)
}
