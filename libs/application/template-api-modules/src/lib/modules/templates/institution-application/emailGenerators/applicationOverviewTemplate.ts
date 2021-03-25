import { Application } from '@island.is/application/core'
import { messages } from '@island.is/application/templates/institution-application'
import get from 'lodash/get'
import { dedent } from 'ts-dedent'

export const applicationOverviewTemplate = (
  application: Application,
): string => {
  const institutionName = get(application.answers, 'applicant.institution')

  const contactName = get(application.answers, 'contact.name')
  const contactEmail = get(application.answers, 'contact.email')
  const contactPhone = get(application.answers, 'contact.phoneNumber')

  const secondaryContactName = get(application.answers, 'secondaryContact.name')
  const secondaryContactEmail = get(
    application.answers,
    'secondaryContact.email',
  )
  const secondaryContactPhone = get(
    application.answers,
    'secondaryContact.phoneNumber',
  )
  const hasSecondaryContact = [
    secondaryContactName,
    secondaryContactEmail,
    secondaryContactPhone,
  ].some((x) => !!x)

  const projectName = get(application.answers, 'project.name')
  const projectGoal = get(application.answers, 'project.goals')
  const projectScope = get(application.answers, 'project.scope')
  const projectFinance = get(application.answers, 'project.finance')
  const projectBackground = get(application.answers, 'project.background')
  const projectStakeholders = get(application.answers, 'stakeholders')
  const projectRole = get(application.answers, 'role')
  const projectOtherRoles = get(application.answers, 'otherRoles')

  const technicalConstraints = get(
    application.answers,
    'constraints.technical',
  ) as boolean
  const financialConstraints = get(
    application.answers,
    'constraints.financial',
  ) as boolean
  const timeConstraints = get(
    application.answers,
    'constraints.time',
  ) as boolean
  const shoppingConstraints = get(
    application.answers,
    'constraints.shopping',
  ) as boolean
  const moralConstraints = get(
    application.answers,
    'constraints.moral',
  ) as boolean
  const otherConstraints = get(
    application.answers,
    'constraints.other',
  ) as boolean

  const hasConstraints = [
    technicalConstraints,
    financialConstraints,
    timeConstraints,
    shoppingConstraints,
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
    timeConstraints
      ? `<p>
  <b>${messages.constraints.constraintsTimeLabel.defaultMessage}</b> </br>
  ${timeConstraints}
  </p>`
      : ''
  }

  ${
    shoppingConstraints
      ? `<p>
  <b>${messages.constraints.constraintsShoppingLabel.defaultMessage}</b> </br>
  ${shoppingConstraints}
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
