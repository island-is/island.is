import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { StaffModel } from '../staff'
import { Op } from 'sequelize'
import { ApplicationState } from '@island.is/financial-aid/shared/lib'
import { AmountModel } from '../amount'
import { DeductionFactorsModel } from '../deductionFactors'
import { DirectTaxPaymentModel } from '../directTaxPayment/models'
import { ApplicationModel } from '../application'
import { ApplicationFileModel } from '../file/models'

@Injectable()
export class OpenApiApplicationService {
  constructor(
    @InjectModel(ApplicationModel)
    private readonly applicationModel: typeof ApplicationModel,
  ) {}

  async getAll(
    municipalityCodes: string,
    startDate: string,
    endDate: string,
    state?: ApplicationState,
  ): Promise<ApplicationModel[]> {
    const whereOptions = state
      ? {
          municipalityCode: municipalityCodes,
          created: { [Op.lte]: endDate, [Op.gte]: startDate },
          state,
        }
      : {
          municipalityCode: municipalityCodes,
          created: { [Op.lte]: endDate, [Op.gte]: startDate },
        }
    return this.applicationModel.findAll({
      attributes: {
        exclude: [
          'staffId',
          'applicationSystemId',
          'interview',
          'homeCircumstances',
          'homeCircumstancesCustom',
          'employment',
          'employmentCustom',
          'student',
          'studentCustom',
        ],
      },
      where: whereOptions,
      order: [['modified', 'DESC']],
      include: [
        {
          model: ApplicationFileModel,
          as: 'files',
          separate: true,
          order: [['created', 'DESC']],
          attributes: ['key', 'name', 'type'],
        },
        {
          model: StaffModel,
          as: 'staff',
          attributes: ['name', 'nationalId'],
        },
        {
          model: AmountModel,
          as: 'amount',
          attributes: [
            'aidAmount',
            'income',
            'personalTaxCredit',
            'tax',
            'finalAmount',
            'spousePersonalTaxCredit',
          ],
          include: [
            {
              model: DeductionFactorsModel,
              as: 'deductionFactors',
              attributes: ['amount', 'description'],
            },
          ],
          separate: true,
          order: [['created', 'DESC']],
        },
        {
          model: DirectTaxPaymentModel,
          as: 'directTaxPayments',
          attributes: {
            exclude: ['id', 'applicationId', 'created', 'modified'],
          },
        },
      ],
    })
  }
}
