import { ApplicationTemplateAPIModule } from '@island.is/application/core'
import { API_MODULE } from '../shared'

// TODO: refactor into an injectable NestJS service
const apiModule: ApplicationTemplateAPIModule = {
  [API_MODULE.sendApplication]: async (application, authorization) => {
    console.log('RUNNING API ACTION:', API_MODULE.sendApplication)
    console.log(`access to application: applicant is ${application.applicant}`)
    console.log(
      `access to authorization header: ${authorization.slice(0, 20)}...`,
    )
  },
}

export default apiModule
