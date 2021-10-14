import { PaymentScheduleApi } from '@island.is/clients/payment-schedule'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'

@Injectable()
export class PublicDebtPaymentPlanTemplateService {
  constructor(
    private paymentScheduleApi: PaymentScheduleApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}
  async sendApplication({ application }: TemplateApiModuleActionProps) {
    // Does nothing for now
    /*this.paymentScheduleApi.schedulesnationalIdPOST6({
      email: '',
      phoneNumber: '',
      nationalId: '',
    })*/
  }
}
