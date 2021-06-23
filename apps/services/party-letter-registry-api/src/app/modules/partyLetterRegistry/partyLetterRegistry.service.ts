import { Inject, Injectable, MethodNotAllowedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op, UniqueConstraintError } from 'sequelize'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { PartyLetterRegistry } from './partyLetterRegistry.model'
import { CreateDto } from './dto/create.dto'

@Injectable()
export class PartyLetterRegistryService {
  constructor(
    @InjectModel(PartyLetterRegistry)
    private partyLetterRegistryModel: typeof PartyLetterRegistry,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  findByOwner(owner: string) {
    this.logger.debug(`Finding party letter for owner - "${owner}"`)
    return this.partyLetterRegistryModel.findOne({
      where: { owner },
    })
  }

  findByManager(manager: string) {
    this.logger.debug(`Finding party letter for manager - "${manager}"`)
    return this.partyLetterRegistryModel.findOne({
      where: {
        managers: {
          [Op.contains]: [manager],
        },
      },
    })
  }

  create(input: CreateDto) {
    this.logger.info(`Creating new party letter entry for ${input.partyLetter}`)
    return this.partyLetterRegistryModel
      .create({
        ...input,
        managers: [...new Set([...input.managers, input.owner])],
      }) // ensure the owner is always a manager
      .catch((error: UniqueConstraintError) => {
        this.logger.error(`Failed to create party letter: ${error.message}`)
        switch (error.constructor) {
          // we want to relay this specific error type to the client
          case UniqueConstraintError: {
            throw new MethodNotAllowedException(
              error.errors.map((err) => err.message),
            )
          }
          default: {
            throw error
          }
        }
      })
  }
}
