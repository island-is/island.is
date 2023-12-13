import { formatText } from '@island.is/application/core'
import {
  Application,
  FormText,
  FormatMessage,
} from '@island.is/application/types'
import { Injectable } from '@nestjs/common'

type Context = {
  application: Application
  formatMessage: FormatMessage
}

@Injectable()
export class ContextService {
  private context: Partial<Context> | null = null

  setContext(application: Application, formatMessage: FormatMessage) {
    this.context = {
      application: application,
      formatMessage: formatMessage,
    }
  }

  getContext(): Context {
    if (
      !this.context ||
      !this.context.application ||
      !this.context.formatMessage
    ) {
      throw new Error(
        'Context is not properly set did you forget to call setContext?',
      )
    }
    return this.context as Context // Type assertion, as we checked for existence above
  }

  formatText(formText: FormText): string {
    const { application, formatMessage } = this.getContext()
    return formatText(formText, application, formatMessage)
  }
}
