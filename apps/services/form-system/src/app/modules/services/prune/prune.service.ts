import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { Application } from '../../applications/models/application.model'
import { Value } from '../../applications/models/value.model'
import {
  ApplicationStatus,
  FieldTypesEnum,
} from '@island.is/form-system/shared'
import { Op } from 'sequelize'

@Injectable()
export class PruneService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @InjectModel(Application)
    private readonly applicationModel: typeof Application,
    private readonly sequelize: Sequelize,
  ) {
    this.logger = logger.child({ context: 'PruneService' })
  }

  public async run() {
    this.logger.info(`Starting application pruning...`)
    await this.fetchApplicationsToBePruned()
    this.logger.info(`Application pruning done.`)
  }
  private async fetchApplicationsToBePruned() {
    const applicationsToBePruned = await this.applicationModel.findAll({
      where: { pruned: false, pruneAt: { [Op.lte]: new Date() } },
      include: [
        {
          model: Value,
          as: 'values',
          required: false,
          where: { fieldType: { [Op.ne]: FieldTypesEnum.APPLICANT } },
        },
      ],
    })

    for (const application of applicationsToBePruned) {
      try {
        if (
          application.isTest ||
          application.status === ApplicationStatus.DRAFT
        ) {
          await application.destroy()
          this.logger.info('test/draft application destroyed', {
            id: application.id,
          })
        } else {
          await this.sequelize.transaction(async (transaction) => {
            await Promise.all(
              application.values?.map((value) =>
                value.destroy({ transaction }),
              ) ?? [],
            )
            await application.update(
              {
                pruned: true,
                prunedAt: new Date(),
              },
              { transaction },
            )
            this.logger.info('application pruned', {
              id: application.id,
            })
          })
        }
      } catch (error) {
        this.logger.error('Failed to prune application', {
          id: application.id,
          error,
        })
      }
    }
  }
}
