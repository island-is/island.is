import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { LandspitaliService } from './landspitali.service'
import { PaymentFlowType, type PaymentCallbackPayload } from './types'

@Injectable()
export class AppService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly landspitaliService: LandspitaliService,
  ) {}

  async handlePaymentFlowUpdate(body: PaymentCallbackPayload) {
    if (
      !(body.details.reason === 'payment_completed' && body.type === 'success')
    ) {
      return
    }

    switch (body.paymentFlowMetadata?.paymentFlowType) {
      case PaymentFlowType.DirectGrant:
        await this.landspitaliService.sendDirectGrantPaymentConfirmationEmail(
          body.paymentFlowMetadata,
        )
        break
      case PaymentFlowType.MemorialCard:
        await this.landspitaliService.sendMemorialCardPaymentConfirmationEmail(
          body.paymentFlowMetadata,
        )
        break
      default:
        this.logger.warn('Unknown landspitali payment type')
        throw new InternalServerErrorException()
    }
  }
}
