import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { DirectTaxPaymentModel } from './models'
import { CreateDirectTaxPaymentDto } from './dto/createDirectTaxPayment.dto'

@Injectable()
export class DirectTaxPaymentService {
  constructor(
    @InjectModel(DirectTaxPaymentModel)
    private readonly directTaxPaymentModel: typeof DirectTaxPaymentModel,
  ) {}

  async create(
    directTaxPayment: CreateDirectTaxPaymentDto,
  ): Promise<DirectTaxPaymentModel> {
    return this.directTaxPaymentModel.create(directTaxPayment)
  }

  async getByApplicationId(id: string): Promise<DirectTaxPaymentModel[]> {
    return this.directTaxPaymentModel.findAll({ where: { applicationId: id } })
  }
}
