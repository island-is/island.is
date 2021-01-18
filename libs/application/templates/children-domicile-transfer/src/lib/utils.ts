import { Application } from '@island.is/application/core'
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