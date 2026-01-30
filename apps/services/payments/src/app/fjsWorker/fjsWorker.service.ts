import { Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  ChargeFjsV2ClientService,
  Charge,
} from '@island.is/clients/charge-fjs-v2'

import { FjsCharge } from '../paymentFlow/models/fjsCharge.model'
import { PaymentFulfillment } from '../paymentFlow/models/paymentFulfillment.model'
import { PaymentFlow } from '../paymentFlow/models/paymentFlow.model'

export class FjsWorkerService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private chargeFjsV2ClientService: ChargeFjsV2ClientService,
    @InjectModel(FjsCharge)
    private readonly fjsChargeModel: typeof FjsCharge,
    @InjectModel(PaymentFulfillment)
    private readonly paymentFulfillmentModel: typeof PaymentFulfillment,
    @InjectModel(PaymentFlow)
    private readonly paymentFlowModel: typeof PaymentFlow,
  ) {}

  public async run() {
    const timer = this.logger.startTimer()

    const createdFJSCharges = 0

    if (createdFJSCharges > 0) {
      this.logger.info(`Finished creating ${createdFJSCharges} FJS charges.`)
    } else {
      this.logger.info(`No FJS charges found to create.`)
    }

    this.logger.info('Worker finished.')
    timer.done()
  }
}
