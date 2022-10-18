import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { FinanceClientService } from '@island.is/clients/finance'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core/messages'
import { m as ndcMessages } from '@island.is/application/templates/no-debt-certificate'

@Injectable()
export class NoDebtCertificateService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private financeService: FinanceClientService,
  ) {
    super(ApplicationTypes.NO_DEBT_CERTIFICATE)
  }

  async getDebtLessCertificate({
    auth,
    currentUserLocale,
  }: TemplateApiModuleActionProps) {
    const lang = currentUserLocale === 'is' ? 'IS' : 'EN'

    const response = await this.financeService.getDebtLessCertificate(
      auth.nationalId,
      lang,
      auth,
    )

    if (response?.error) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.errorDataProvider,
          summary: response.error.message,
        },
        response.error.code,
      )
    }

    if (
      response?.debtLessCertificateResult &&
      !response.debtLessCertificateResult.debtLess
    ) {
      throw new TemplateApiError(
        {
          title: ndcMessages.missingCertificateTitle,
          summary: ndcMessages.missingCertificateSummary,
          hideSubmitError: true,
        },
        400,
      )
    }

    return response
  }
}
