import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { MessageSuspensionCategory } from '@island.is/judicial-system/message'

import { MessageSuspension } from '../models/messageSuspension.model'

interface UpdateMessageSuspension {
  suspended?: boolean
  delaySeconds?: number
  modifiedBy?: string
}

@Injectable()
export class MessageSuspensionRepositoryService {
  constructor(
    @InjectModel(MessageSuspension)
    private readonly messageSuspensionModel: typeof MessageSuspension,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findAll(): Promise<MessageSuspension[]> {
    this.logger.debug('Finding all message suspensions')

    return this.messageSuspensionModel.findAll({
      order: [['category', 'ASC']],
    })
  }

  async update(
    category: MessageSuspensionCategory,
    update: UpdateMessageSuspension,
  ): Promise<MessageSuspension> {
    this.logger.debug(`Updating message suspension ${category}`)

    const [numberOfAffectedRows, updatedSuspensions] =
      await this.messageSuspensionModel.update(update, {
        where: { category },
        returning: true,
      })

    if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not update message suspension ${category}`,
      )
    }

    return updatedSuspensions[0]
  }
}
