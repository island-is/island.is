import { ProblemType, ProviderErrorReason } from '@island.is/shared/problem'
import { ProblemError } from './ProblemError'

export class TemplateApiError extends ProblemError {
  constructor(errorReason: ProviderErrorReason, status: number) {
    super({
      type: ProblemType.TEMPLATE_API_ERROR,
      title: 'Application TemplateApi Error',
      status,
      errorReason,
    })
  }
}
