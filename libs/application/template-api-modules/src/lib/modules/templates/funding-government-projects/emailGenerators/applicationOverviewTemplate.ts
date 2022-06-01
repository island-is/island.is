import { Application } from '@island.is/application/core'
import {
  messages,
  FundingGovernmentProjectsAnswers,
} from '@island.is/application/templates/funding-government-projects'
import { dedent } from 'ts-dedent'

export const applicationOverviewTemplate = (
  application: Application,
): string => {
  const answers = application.answers as FundingGovernmentProjectsAnswers

  return dedent(`
    <h3>${messages.section.informationAboutInstitution.defaultMessage}</h3>
    <p>
      <b>${
        messages.informationAboutInstitution.general
          .infoInstitutionTextFieldTitle.defaultMessage
      }</b> </br>
      ${answers.organizationOrInstitutionName}
    </p>

    <h3>${
      messages.informationAboutInstitution.labels.informationAboutContact
        .defaultMessage
    }</h3>
    <p>
      ${answers.contacts.map(
        (contact) => `
        <p>
         <b>${messages.informationAboutInstitution.labels.contactName.defaultMessage}</b><br />
         ${contact.name}<br /><br />
         <b>${messages.informationAboutInstitution.labels.contactPhoneNumber.defaultMessage}</b><br />
         ${contact.phoneNumber}<br /><br />
         <b>${messages.informationAboutInstitution.labels.contactEmail.defaultMessage}</b><br />
         ${contact.email}<br /><br />
        </p>
      `,
      )}
    </p>

    <h3>${messages.section.project.defaultMessage}</h3>
    <p>
      <b>${messages.project.labels.title.defaultMessage}</b> </br>
      ${answers.project.title}
    </p>
    <p>
      <b>${messages.project.labels.description.defaultMessage}</b> </br>
      ${answers.project.description}
    </p>
    <p>
      <b>${messages.project.labels.cost.defaultMessage}</b> </br>
      ${answers.project.cost}
    </p>
    <p>
      <b>${messages.project.labels.years.defaultMessage}</b> </br>
      ${answers.project.refundableYears} ${
    messages.shared.yearPlural.defaultMessage
  }
    </p>
    <p>
      <b>${messages.project.labels.attachmentsTitle.defaultMessage}</b> </br>
      ${answers.project.attachments?.map(
        (attachment) => `
        ${attachment.name}
      `,
      )}
    </p>
  `)
}
