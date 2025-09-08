import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { AppConfig } from './app.config'
import { LandspitaliService } from './landspitali.service'
import { LandspitaliPaymentType, type PaymentCallbackPayload } from './types'

@Injectable()
export class AppService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(AppConfig.KEY)
    private readonly landspitaliService: LandspitaliService,
  ) {}

  async handlePaymentFlowUpdate(body: PaymentCallbackPayload) {
    switch (body.paymentFlowMetadata?.landspitaliPaymentType) {
      case LandspitaliPaymentType.DirectGrant:
        await this.landspitaliService.sendDirectGrantPaymentConfirmationEmail(
          body.paymentFlowMetadata,
        )
        break
      case LandspitaliPaymentType.MemorialCard:
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
