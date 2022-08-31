import { ProviderErrorReason } from '@island.is/application/types'
import { ProblemError } from '@island.is/nest/problem'
import { ProblemType } from '@island.is/shared/problem'

export class TemplateApiProblemError extends ProblemError {
  constructor(errorReason: ProviderErrorReason, statusCode: number) {
    super({
      type: ProblemType.TEMPLATE_API_ERROR,
      title: 'Application TemplateApi Error',
      status: statusCode,
      errorReason,
    })
  }
}
