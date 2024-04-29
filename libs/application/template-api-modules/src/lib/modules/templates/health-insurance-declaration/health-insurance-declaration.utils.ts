import { Application } from '@island.is/application/types'
import {
  ApplicantType,
  HealthInsuranceDeclarationApplication,
} from '@island.is/application/templates/health-insurance-declaration'
import { DocumentInfo } from './attachments/provider'
import {
  InsuranceStatementsStudentApplicationDTO,
  InsuranceStatementsApplicantDTO,
  InsuranceStatementsTouristApplicationDTO,
} from '@island.is/clients/icelandic-health-insurance/rights-portal'

export const getApplicantType = (application: Application) => {
  return application.answers.studentOrTravellerRadioFieldTraveller
}

export const applicationToStudentApplication = (
  application: Application,
  attachments: DocumentInfo[],
): InsuranceStatementsStudentApplicationDTO => {
  const healthInsuranceApplication =
    application as HealthInsuranceDeclarationApplication
  return {
    applicants: getApplicants(healthInsuranceApplication),
    countryCode: getResidencyCode(healthInsuranceApplication),
    dateFrom: getStartDate(healthInsuranceApplication),
    dateTo: getEndDate(healthInsuranceApplication),
    attachment: attachments[0],
  }
}

export const applicationToTravellerApplication = (
  application: Application,
): InsuranceStatementsTouristApplicationDTO => {
  const healthInsuranceApplication =
    application as HealthInsuranceDeclarationApplication
  return {
    applicants: getApplicants(healthInsuranceApplication),
    continentCode: getResidencyCode(healthInsuranceApplication),
    dateFrom: getStartDate(healthInsuranceApplication),
    dateTo: getEndDate(healthInsuranceApplication),
  }
}

const getApplicants = (
  application: HealthInsuranceDeclarationApplication,
): InsuranceStatementsApplicantDTO[] => {
  const answers = application.answers
  const applicants: InsuranceStatementsApplicantDTO[] = []

  // Applicant
  if (answers.isHealthInsured) {
    applicants.push({
      nationalId: answers.applicant.nationalId,
      name: answers.applicant.name,
      type: 0,
    })
  }

  // Spouse
  answers.registerPersonsSpouseCheckboxField.map((s) => {
    const externalSpouse =
      application.externalData.nationalRegistrySpouse.data.nationalId === s
        ? application.externalData.nationalRegistrySpouse.data
        : undefined
    if (externalSpouse) {
      applicants.push({
        nationalId: externalSpouse.nationalId,
        name: externalSpouse.fullName
          ? externalSpouse.fullName
          : externalSpouse.name
          ? externalSpouse.name
          : '',
        type: 1,
      })
    }
  })
  // Children
  answers.registerPersonsChildrenCheckboxField.map((c) => {
    const child = application.externalData.childrenCustodyInformation.data.find(
      (externalChild) => externalChild.nationalId === c,
    )
    if (child) {
      applicants.push({
        nationalId: child.nationalId,
        name: child.fullName,
        type: 2,
      })
    }
  })
  return applicants
}

const getResidencyCode = (
  application: HealthInsuranceDeclarationApplication,
): string | undefined => {
  const type = getApplicantType(application)
  if (type === ApplicantType.STUDENT) {
    return application.answers.residencyStudentSelectField || ''
  }
  return application.answers.residencyTravellerRadioField || ''
}

const getStartDate = (
  application: HealthInsuranceDeclarationApplication,
): Date | undefined => {
  return new Date(application.answers.period.dateFieldFrom)
}
const getEndDate = (
  application: HealthInsuranceDeclarationApplication,
): Date | undefined => {
  return new Date(application.answers.period.dateFieldTo)
}
