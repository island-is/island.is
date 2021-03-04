import { Application, FormValue } from '@island.is/application/core'
import { NationalRegistryUser } from '@island.is/api/schema'
import {
  PersonResidenceChange,
  ParentResidenceChange,
} from '../dataProviders/APIDataTypes'

export const extractApplicantFromApplication = (application: Application) => {
  return (application.externalData.nationalRegistry?.data as {
    parent?: object
  }) as NationalRegistryUser
}

const dataToUse = ({ answers, externalData }: Application, key: string) => {
  return (
    ((answers.mockData as FormValue)?.[key] as FormValue)?.data ||
    externalData[key]?.data
  )
}

export const extractParentFromApplication = (application: Application) => {
  const data = dataToUse(application, 'parentNationalRegistry')
  return (data as {
    parent?: object
  }) as ParentResidenceChange
}

export const extractChildrenFromApplication = (application: Application) => {
  const data = dataToUse(application, 'childrenNationalRegistry')
  return (data as {
    registeredChildren?: object
  }) as PersonResidenceChange[]
}

export const extractAnswersFromApplication = (application: Application) => {
  return {
    selectedChildren: application.answers.selectChild as string[],
    selectedDuration: application.answers.selectDuration as string[],
    reason: application.answers.residenceChangeReason as string,
    interview: application.answers.interview as 'yes' | 'no',
    contactInformation: {
      email: application.answers.email,
      phoneNumber: application.answers.phoneNumber,
    },
  }
}

export const constructParentAddressString = (parent: ParentResidenceChange) => {
  if (!parent) {
    return null
  }
  return `${parent?.address}, ${parent?.postalCode} ${parent?.city}`
}
