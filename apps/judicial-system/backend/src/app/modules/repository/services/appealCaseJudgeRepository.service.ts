import { Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { AppealCaseJudge } from '../models/appealCaseJudge.model'

@Injectable()
export class AppealCaseJudgeRepositoryService {
  constructor(
    @InjectModel(AppealCaseJudge)
    private readonly appealCaseJudgeModel: typeof AppealCaseJudge,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  // Replaces the bench of an appeal case with the given judges, in the given
  // order: the first user id becomes the presiding judge. An empty list clears
  // the bench.
  async replaceForAppealCase(
    appealCaseId: string,
    userIds: string[],
    options: { transaction: Transaction },
  ): Promise<void> {
    const { transaction } = options

    try {
      this.logger.debug(
        `Replacing the judges of appeal case ${appealCaseId} (${userIds.length} judges)`,
      )

      await this.appealCaseJudgeModel.destroy({
        where: { appealCaseId },
        transaction,
      })

      if (userIds.length === 0) {
        return
      }

      await this.appealCaseJudgeModel.bulkCreate(
        userIds.map((userId, displayOrder) => ({
          appealCaseId,
          userId,
          displayOrder,
        })),
        { transaction },
      )

      this.logger.debug(`Replaced the judges of appeal case ${appealCaseId}`)
    } catch (error) {
      this.logger.error(
        `Error replacing the judges of appeal case ${appealCaseId}:`,
        { error },
      )

      throw error
    }
  }
}
