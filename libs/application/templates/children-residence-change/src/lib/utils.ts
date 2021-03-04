import { Application, FormValue } from '@island.is/application/core'
import { NationalRegistryUser } from '@island.is/api/schema'
import { PersonResidenceChange } from '../dataProviders/APIDataTypes'

export const extractApplicantFromApplication = (application: Application) => {
  return (application.externalData.nationalRegistry?.data as {
    parent?: object
  }) as NationalRegistryUser
}

const dataToUse = ({ answers, externalData }: Application, key: string) => {
  const mockData = ((answers.mockData as FormValue)?.[key] as FormValue)?.data
  const data = externalData[key]?.data
  if (answers.useMocks === 'no') {
    return data
  }
  return mockData || data
}

export const extractParentFromApplication = (application: Application) => {
  const data = dataToUse(application, 'parentNationalRegistry')
  return (data as {
    parent?: object
  }) as PersonResidenceChange
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

export const constructParentAddressString = (parent: PersonResidenceChange) => {
  if (!parent) {
    return null
  }
  return `${parent?.address}, ${parent?.postalCode} ${parent?.city}`
}
