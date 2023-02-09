import { ApplicationWithAttachments } from '@island.is/application/types'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { StaticText } from 'static-text'
import { History } from './history.model'

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(History)
    private historyModel: typeof History,
    private sequelize: Sequelize,
  ) {}

  async getHistoryByApplicationId(
    applicationId: string,
  ): Promise<History[] | []> {
    return this.historyModel.findAll({
      where: {
        application_id: applicationId,
      },
    })
  }

  async createHistoryLog(
    application: ApplicationWithAttachments,
    log: StaticText,
  ): Promise<History> {
    return this.historyModel.create({
      application_id: application.id,
      log: typeof log === 'string' ? log : JSON.stringify(log),
      date: new Date(),
    })
  }

  async deleteHistoryByApplicationId(applicationId: string): Promise<void> {
    await this.historyModel.destroy({
      where: {
        application_id: applicationId,
      },
    })
  }
}
