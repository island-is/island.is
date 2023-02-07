import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
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
    entry: Partial<Pick<History, 'application_id' | 'contentful_id'>>,
  ): Promise<History> {
    return this.historyModel.create({
      application_id: entry.application_id,
      contentful_id: entry.contentful_id,
    })
  }
}
