import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

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

  async create(dateLog: CreateDateLogDto): Promise<void> {
    const { dateType, caseId, date } = dateLog

    try {
      await this.dateLogModel.create({
        dateType,
        caseId,
        date,
      })
    } catch (error) {
      this.logger.error('Failed to create date log', error)
    }
  }
}
