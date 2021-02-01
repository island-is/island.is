import { Application } from '@island.is/application/core'
import { NationalRegistryUser } from '@island.is/api/schema'
import { PersonResidenceChange, ParentResidenceChange } from '../dataProviders/APIDataTypes'

export const extractApplicantFromApplication = (application: Application) => {
  return (application.externalData.nationalRegistry?.data as {
    parent?: object
  }) as NationalRegistryUser
}

export const extractParentFromApplication = (application: Application) => {
  return (application.externalData.parentNationalRegistry?.data as {
    parent?: object
  }) as ParentResidenceChange
}

export const extractChildrenFromApplication = (application: Application) => {
  return (application.externalData.childrenNationalRegistry?.data as {
    registeredChildren?: object
  }) as PersonResidenceChange[]
}

export const extractAnswersFromApplication = (application: Application) => {
  return {
    selectedChildren: application.answers.selectChild as string[],
    selectedDuration: application.answers.selectDuration as string,
    durationDate: application.answers.durationDate as string,
  }
}

export const constructParentAddressString = (parent: ParentResidenceChange) => {
  if (!parent) {
    return null
  }
  return `${parent?.address}, ${parent?.postalCode} ${parent?.city}`
}
