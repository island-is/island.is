import { Application } from '@island.is/application/types'
import { Injectable } from '@nestjs/common'

type Context = {
  applicationData?: Application
}

@Injectable()
export class ContextService {
  private context: Context

  constructor() {
    this.context = {
      applicationData: undefined,
    }
  }

  setContext(application: Application) {
    this.context.applicationData = application
  }

  getContext(): Context {
    if (!this.context.applicationData) {
      throw new Error('Application data not set in context')
    }
    return this.context
  }
}
