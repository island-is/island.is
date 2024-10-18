import { ProblemType, ProviderErrorReason } from '@island.is/shared/problem'
import { StaticText } from '@island.is/shared/types'
import { ProblemError } from './ProblemError'

export class TemplateApiError extends ProblemError {
  constructor(
    errorReason:
      | ProviderErrorReason
      | StaticText
      | string
      | ProviderErrorReason[],
    status: number,
  ) {
    super({
      type: ProblemType.TEMPLATE_API_ERROR,
      title: 'Application TemplateApi Error',
      status,
      errorReason,
    })
  }
}
