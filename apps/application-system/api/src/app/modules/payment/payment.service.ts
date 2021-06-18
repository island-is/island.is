import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Payment } from './payment.model'
import { Op } from 'sequelize'

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
  ) {}

  findPaymentByApplicationId(applicationId: string): Promise<Payment | null> {
    return this.paymentModel.findOne({
      where: {
        application_id: { [Op.eq]: applicationId },
      },
      limit: 1,
      order: [['modified', 'DESC']],
    })
  }
}
