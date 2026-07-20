import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { NotificationsService } from '../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../types'
import { FinanceClientV3Service } from '@island.is/clients/finance-v3'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class GovernmentDebtPaymentService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
    private readonly financeClientV3Service: FinanceClientV3Service,
  ) {
    super(ApplicationTypes.GOVERNMENT_DEBT_PAYMENT)
  }

  async getCustomerDebts({ auth }: TemplateApiModuleActionProps) {
    this.logger.info('Fetching customer debts', {
      nationalId: auth.nationalId,
    })

    try {
      const debts = await this.financeClientV3Service.getCustomerDebts(auth, {
        nationalID: auth.nationalId,
      })
      // Convert BigInt values to numbers for JSON serialization
      return JSON.parse(
        JSON.stringify(debts, (_key, value) =>
          typeof value === 'bigint' ? Number(value) : value,
        ),
      )
    } catch (e) {
      this.logger.error('Failed to fetch customer debts', {
        error: e,
      })
      throw e
    }
  }
}
