import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Entry } from './types'
import { AppRepository } from './app.repository'
import slugify from '@sindresorhus/slugify'

const TAGGABLE_ENTRY_PREFIX = 'owner-'

@Injectable()
export class AppService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly appRepository: AppRepository,
  ) {}

  async tagEntry(entry: Entry) {
    const roles = await this.appRepository.getUserSpaceRoles(
      entry.sys.createdBy.sys.id,
    )

    const tags = roles
      // All roles with the prefix need to have their entries tagged in order to manage user permissions
      .filter((role) =>
        role.name.toLowerCase().startsWith(TAGGABLE_ENTRY_PREFIX),
      )
      .map((role) => slugify(role.name))

    if (tags.length === 0) {
      return
    }

    this.logger.info(
      `Attempting to tag entry or asset with id: ${
        entry.sys.id
      } with tags: ${tags.join(', ')}`,
    )

    const result = await this.appRepository.tagEntry(entry, tags)
    this.logger.info(`Entry or asset with id: ${entry.sys.id} has been tagged`)
    return result
  }

  async handleEntryCreation(entry: Entry) {
    try {
      this.logger.info(`Entry or asset with id ${entry.sys.id} got created`)
      const result = await this.tagEntry(entry)
      return result
    } catch (error) {
      this.logger.error(
        'Error occured when handling entry creation webhook event',
        error,
      )
      throw new HttpException(
        'Error occured when handling request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
