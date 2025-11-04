import {
  ApplicantChildCustodyInformation,
  Application,
  NationalRegistryIndividual,
  NationalRegistrySpouseV3,
} from '@island.is/application/types'
import {
  HealthInsuranceDeclarationApplication,
  InsuranceStatementData,
  SubmitApplicationData,
} from '@island.is/application/templates/iceland-health/health-insurance-declaration'
import { DocumentInfo } from './attachments/provider'
import {
  InsuranceStatementsStudentApplicationDTO,
  InsuranceStatementsApplicantDTO,
  InsuranceStatementsTouristApplicationDTO,
} from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { ApplicantType } from './consts'

export const getApplicantType = (application: Application) => {
  return application.answers.studentOrTouristRadioFieldTourist
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

export const applicationToTouristApplication = (
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
  answers.selectedApplicants?.registerPersonsApplicantCheckboxField?.forEach(
    () => {
      applicants.push({
        nationalId: answers.applicant.nationalId,
        name: answers.applicant.name,
        type: 0,
      })
    },
  )

  // Spouse
  answers.selectedApplicants?.registerPersonsSpouseCheckboxField?.forEach(
    (s) => {
      const externalSpouse =
        application.externalData.nationalRegistrySpouse.data.nationalId === s
          ? application.externalData.nationalRegistrySpouse.data
          : undefined
      if (externalSpouse) {
        applicants.push({
          nationalId: externalSpouse.nationalId,
          name: externalSpouse.name,
          type: 1,
        })
      }
    },
  )
  // Children
  answers.selectedApplicants?.registerPersonsChildrenCheckboxField?.forEach(
    (c) => {
      const child =
        application.externalData.childrenCustodyInformation.data.find(
          (externalChild) => externalChild.nationalId === c,
        )
      if (child) {
        applicants.push({
          nationalId: child.nationalId,
          name: child.fullName,
          type: 2,
        })
      }
    },
  )
  return applicants
}

export const getApplicantsFromExternalData = ({
  externalData,
}: Application) => {
  return (externalData.submitApplication.data as SubmitApplicationData)
    .applicants
}
export const getChildrenFromExternalData = ({ externalData }: Application) => {
  return (
    (externalData?.childrenCustodyInformation
      ?.data as ApplicantChildCustodyInformation[]) ?? []
  )
}
export const getSpouseFromExternalData = ({ externalData }: Application) => {
  return externalData?.nationalRegistrySpouse?.data as NationalRegistrySpouseV3
}

export const getPersonsFromExternalData = (application: Application) => {
  const children = getChildrenFromExternalData(application)
  const spouse = getSpouseFromExternalData(application)
  const persons = [
    {
      nationalId: (
        application.externalData.nationalRegistry
          .data as NationalRegistryIndividual
      ).nationalId,
      name: (
        application.externalData.nationalRegistry
          .data as NationalRegistryIndividual
      ).fullName,
    },
  ]
  if (spouse) {
    persons.push({
      nationalId: spouse.nationalId,
      name: spouse.name,
    })
  }
  children.map((child) => {
    persons.push({
      nationalId: child.nationalId,
      name: child.fullName,
    })
  })
  return persons
}

export const getApplicantInsuranceStatus = ({ externalData }: Application) => {
  return (externalData.insuranceStatementData.data as InsuranceStatementData)
    .canApply
}

const getResidencyCode = (
  application: HealthInsuranceDeclarationApplication,
): string | undefined => {
  const type = getApplicantType(application)
  if (type === ApplicantType.STUDENT) {
    return application.answers.residencyStudentSelectField || ''
  }
  return application.answers.residencyTouristRadioField || ''
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
