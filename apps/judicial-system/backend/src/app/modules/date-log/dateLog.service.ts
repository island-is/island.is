import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { DateType } from '@island.is/judicial-system/types'

import { CreateDateLogDto } from './dto/createDateLog.dto'
import { DateLog } from './models/dateLog.model'

@Injectable()
export class DateLogService {
  constructor(
    @InjectModel(DateLog)
    private readonly dateLogModel: typeof DateLog,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async create(date: CreateDateLogDto): Promise<void> {
    const { dateType, caseId, courtDate } = date

    try {
      await this.dateLogModel.create({
        dateType,
        caseId,
        courtDate,
      })
    } catch (error) {
      this.logger.error('Failed to create date log', error)
    }
  }

  async findDateTypeByCaseId(dateType: DateType, caseId: string) {
    return this.dateLogModel.findOne({
      where: {
        caseId,
        dateType,
      },
      order: [['created', 'DESC']],
    })
  }
}
