import { Injectable } from '@nestjs/common'
import { Application } from './models/application.model'
import { CreateApplicationInput } from './dto/createApplication.input'

@Injectable()
export class ApplicationService {
  createClient(input: CreateApplicationInput) {
    const application = new Application()
    application.applicationId = input.applicationId
    application.applicationType = input.applicationType
    application.environments = input.environments
    application.displayName = input.displayName

    // TODO connect to REST service

    return application
  }
}
