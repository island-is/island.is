import {
  ApplicationStatus,
  FieldTypesEnum,
} from '@island.is/form-system/shared'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { ValueType } from '../../../dataTypes/valueTypes/valueType.model'
import { Application } from '../../applications/models/application.model'
import { Value } from '../../applications/models/value.model'
import { FileService } from '../../file/file.service'

@Injectable()
export class PruneService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @InjectModel(Application)
    private readonly applicationModel: typeof Application,
    private readonly sequelize: Sequelize,
    private readonly fileService: FileService,
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

    this.logger.info(
      `Found ${applicationsToBePruned.length} applications to be pruned.`,
    )

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
              application.values?.map((value) => {
                if (value.fieldType === FieldTypesEnum.FILE) {
                  const json = JSON.stringify(value.json) as ValueType
                  const keys = json.s3Key as string[]
                  keys.forEach(async (key) => {
                    await this.fileService.deleteFile(key, value.id)
                  })
                }
                return value.destroy({ transaction })
              }) ?? [],
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
