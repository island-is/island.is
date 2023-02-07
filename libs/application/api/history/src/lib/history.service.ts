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

  async createHistoryEntry(
    application: ApplicationWithAttachments,
    entry: StaticText,
  ): Promise<History> {
    return this.historyModel.create({
      application_id: application.id,
      contentful_id: typeof entry === 'string' ? entry : JSON.stringify(entry),
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
