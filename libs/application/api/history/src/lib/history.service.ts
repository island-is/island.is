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

  async getStateHistory(applicationIds: string[]): Promise<History[]> {
    return this.historyModel.findAll({
      where: {
        application_id: applicationIds,
      },
    })
  }

  async saveStateTransition(
    applicationId: string,
    newStateKey: string,
  ): Promise<History> {
    // Look for a state that has not been exited.
    const lastState = (await this.getStateHistory([applicationId])).find(
      (x) => x.exitTimestamp === null,
    )

    if (lastState) {
      //update with a new exit timestamp.
      this.historyModel.update(
        {
          ...lastState,
          exitTimestamp: new Date(),
        },
        { where: { id: lastState.id } },
      )
    }

    return this.historyModel.create({
      application_id: applicationId,
      stateKey: newStateKey,
      entryTimestamp: new Date(),
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
