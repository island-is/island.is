import { Application } from '@island.is/application/core'
import { Parent, RegisteredChildren } from '../dataProviders/APIDataTypes'

export const extractParentFromApplication = (application: Application) => {
  return (application.externalData.parentNationalRegistry?.data as {
    parent?: object
  }) as Parent
}

export const extractChildrenFromApplication = (application: Application) => {
  return (application.externalData.childrenNationalRegistry?.data as {
    registeredChildren?: object
  }) as RegisteredChildren[]
}

export const extractAnswersFromApplication = (application: Application) => {
  return {
    selectedChildren: application.answers.selectChild as string[],
    selectedDuration: application.answers.selectDuration as string,
    durationDate: application.answers.durationDate as string,
  }
}
