import { Application, FormValue } from '@island.is/application/core'
import {
  AccidentNotificationAnswers,
  CompanyInfo,
  messages,
  utils,
} from '@island.is/application/templates/accident-notification'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import parseISO from 'date-fns/parseISO'
import { dedent } from 'ts-dedent'

const YES = 'yes'

const getAthleteEmployeeAnswer = (info: CompanyInfo) =>
  info.employee?.radioButton === YES
    ? messages.application.general.yesOptionLabel
    : messages.application.general.noOptionLabel

const getInjuredPersonInformation = (answers: AccidentNotificationAnswers) => `
<p>
  <b>${messages.injuredPersonInformation.labels.name.defaultMessage}</b> 
  ${answers.injuredPersonInformation.name}
</p>
<p>
  <b>${messages.injuredPersonInformation.labels.nationalId.defaultMessage}</b> 
  ${answers.injuredPersonInformation.nationalId}
</p>
<p>
  <b>${messages.injuredPersonInformation.labels.email.defaultMessage}</b> 
  ${answers.injuredPersonInformation.email}
</p>
<p>
  <b>${messages.injuredPersonInformation.labels.tel.defaultMessage}</b> 
  ${answers.injuredPersonInformation.phoneNumber}
</p> </br>
`

const getApplicantInformation = (answers: AccidentNotificationAnswers) => `
<p>
  <b>${messages.applicantInformation.labels.name.defaultMessage}</b> 
  ${answers.applicant.name}
</p>
<p>
  <b>${messages.applicantInformation.labels.nationalId.defaultMessage}</b> 
  ${answers.applicant.nationalId}
</p>
<p>
  <b>${messages.applicantInformation.labels.address.defaultMessage}</b> 
  ${answers.applicant.address}
</p>
<p>
  <b>${messages.applicantInformation.labels.city.defaultMessage}</b> 
  ${answers.applicant.city}
</p>
<p>
  <b>${messages.applicantInformation.labels.email.defaultMessage}</b> 
  ${answers.applicant.email}
</p>
<p>
  <b>${messages.applicantInformation.labels.tel.defaultMessage}</b> 
  ${answers.applicant.phoneNumber}
</p> </br>
`

export const overviewTemplate = (application: Application): string => {
  const answers = application.answers as AccidentNotificationAnswers
  const workplaceData = utils.getWorkplaceData(answers as FormValue)

  const { timeOfAccident, dateOfAccident } = answers.accidentDetails
  const time = `${timeOfAccident.slice(0, 2)}:${timeOfAccident.slice(2, 4)}`
  const date = format(parseISO(dateOfAccident), 'dd.MM.yy', { locale: is })

  // TODO: finish this and add translations
  return dedent(`
    <h2>Yfirlit tilkynningar</h2>
    <h3>${messages.injuredPersonInformation.general.heading.defaultMessage}</h3>
    ${
      utils.isReportingOnBehalfOfInjured(answers as FormValue)
        ? getInjuredPersonInformation(answers)
        : getApplicantInformation(answers)
    }
    ${
      utils.isReportingOnBehalfOfEmployee(answers as FormValue)
        ? `
      <h3>${messages.juridicalPerson.general.title.defaultMessage}</h3>
      <p>
        <b>${messages.juridicalPerson.labels.companyName.defaultMessage}</b>
        ${answers.juridicalPerson.companyName}
      </p>
      <p>
        <b>${messages.juridicalPerson.labels.companyNationalId.defaultMessage}</b>
        ${answers.juridicalPerson.companyNationalId}
      </p> </br>
    `
        : ''
    }
    ${
      workplaceData &&
      !utils.isReportingOnBehalfOfEmployee(answers as FormValue)
        ? `
        <h3>${workplaceData.general.title.defaultMessage}</h3>
        <p>
          <b>${workplaceData.labels.nationalId.defaultMessage}</b>
          ${workplaceData.info.nationalRegistrationId}
        </p>
        ${
          utils.isProfessionalAthleteAccident(answers as FormValue) &&
          workplaceData.info.employee
            ? `
            <p>
              <b>${
                messages.sportsClubInfo.employee.sectionTitle.defaultMessage
              }</b>
              ${getAthleteEmployeeAnswer(workplaceData.info)}
            </p>
        `
            : ''
        }
        ${
          answers.isRepresentativeOfCompanyOrInstitue?.toString() !== YES
            ? `
            </br> <h3>${workplaceData.labels.descriptionField.defaultMessage}</h3>
            <p>
              <b>${workplaceData.labels.name.defaultMessage}</b>
              ${workplaceData.info.name}
            </p>
            <p>
              <b>${workplaceData.labels.email.defaultMessage}</b>
              ${workplaceData.info.email}
            </p>
            <p>
              <b>${workplaceData.labels.tel.defaultMessage}</b>
              ${workplaceData.info.phoneNumber}
            </p>
        `
            : ''
        }
        </br>
    `
        : ''
    }
    <h3>${messages.accidentDetails.general.sectionTitle.defaultMessage}</h3>
    <p>
      <b>${messages.overview.labels.accidentType.defaultMessage}</b>
      ${
        messages.accidentType.labels[answers.accidentType.radioButton]
          .defaultMessage
      }
    </p>
    <p>
      <b>${messages.accidentDetails.labels.date.defaultMessage}</b>
      ${date}
    </p>
    <p>
      <b>${messages.accidentDetails.labels.time.defaultMessage}</b>
      ${time}
    </p>
    <p>
      <b>${messages.accidentDetails.labels.description.defaultMessage}</b> </br>
      ${answers.accidentDetails.descriptionOfAccident}
    </p>
  `)
}
