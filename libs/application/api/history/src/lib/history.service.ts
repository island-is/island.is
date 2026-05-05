import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Transaction } from 'sequelize'
import { History } from './history.model'
import type { User } from '@island.is/auth-nest-tools'

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(History)
    private historyModel: typeof History,
  ) {}

  async getStateHistory(
    applicationIds: string[],
    transaction?: Transaction,
  ): Promise<History[]> {
    return this.historyModel.findAll({
      where: {
        application_id: applicationIds,
      },
      transaction,
    })
  }

  async saveStateTransition(
    applicationId: string,
    newStateKey: string,
    auth: User,
    exitEvent?: string,
    transaction?: Transaction,
  ): Promise<History> {
    //Do we have a current state to move from. Look for a state that has not been exited.
    const lastState = (
      await this.getStateHistory([applicationId], transaction)
    ).find((x) => x.exitTimestamp === null)

    if (lastState) {
      //update with a new exit timestamp.
      await this.historyModel.update(
        {
          ...lastState,
          exitTimestamp: new Date(),
          exitEvent,
          exitEventSubjectNationalId: auth.nationalId,
          exitEventActorNationalId: auth.actor
            ? auth.actor.nationalId
            : auth.nationalId,
        },
        { where: { id: lastState.id }, transaction },
      )
    }

    return this.historyModel.create(
      {
        application_id: applicationId,
        stateKey: newStateKey,
        entryTimestamp: new Date(),
        previousState: lastState ? lastState.id : null,
      },
      { transaction },
    )
  }

  async postPruneHistoryByApplicationId(applicationId: string): Promise<void> {
    await this.historyModel.update(
      {
        exitEventSubjectNationalId: null,
        exitEventActorNationalId: null,
      },
      {
        where: {
          application_id: applicationId,
        },
      },
    )
  }

  async deleteHistoryByApplicationId(applicationId: string): Promise<void> {
    await this.historyModel.destroy({
      where: {
        application_id: applicationId,
      },
    })
  }
}
