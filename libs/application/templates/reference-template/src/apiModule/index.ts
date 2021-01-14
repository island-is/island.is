import { ApplicationTemplateAPIModule } from '@island.is/application/core'
import { API_MODULE } from '../shared'

// TODO: refactor into an injectable NestJS service
const apiModule: ApplicationTemplateAPIModule = {
  [API_MODULE.validateSomethingImportant]: async (
    application,
    authorization,
  ) => {
    console.log('RUNNING API ACTION:', API_MODULE.validateSomethingImportant)
    console.log(`access to application: applicant is ${application.applicant}`)
    console.log(
      `access to authorization header: ${authorization.slice(0, 20)}...`,
    )
    await new Promise((resolve) => setTimeout(resolve, 10000))
  },
  [API_MODULE.performSomeAPIAction]: async () => {
    console.log('RUNNING API ACTION:', API_MODULE.performSomeAPIAction)
  },
  [API_MODULE.sendApplication]: async (application) => {
    console.log('RUNNING API ACTION:', API_MODULE.sendApplication)
    console.log(JSON.stringify(application, null, '  '))
  },
}

export default apiModule
