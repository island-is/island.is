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
import { createPdf } from '../../formatters/createPdf'
import {
  Base64EncodedPdf,
  PdfApplicationResponse,
} from './pdfApplication.response'
import { ChildrenModel } from '../children'
import { ApplicationEventModel } from '../applicationEvent'

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
            'childrenAidAmount',
            'decemberAidAmount',
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

  async getApplicationPdfById(
    municipalityCodes: string,
    id: string,
  ): Promise<PdfApplicationResponse> {
    const application = await this.applicationModel.findOne({
      where: {
        id: id,
        municipalityCode: municipalityCodes,
        state: {
          [Op.or]: [ApplicationState.REJECTED, ApplicationState.APPROVED],
        },
      },
      attributes: {
        exclude: ['staffId', 'applicationSystemId'],
      },
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
          model: ApplicationEventModel,
          as: 'applicationEvents',
          separate: true,
          order: [['created', 'DESC']],
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
            'childrenAidAmount',
            'decemberAidAmount',
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
        {
          model: ChildrenModel,
          as: 'children',
          separate: true,
          order: [['created', 'DESC']],
        },
      ],
    })

    try {
      const pdfFile = await createPdf(application)
      return { file: pdfFile as Base64EncodedPdf }
    } catch (error) {
      throw new Error('Failed to generate PDF: ' + error.message)
    }
  }
}
