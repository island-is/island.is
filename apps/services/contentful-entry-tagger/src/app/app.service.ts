import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Entry } from './types'
import { AppRepository } from './app.repository'
import slugify from '@sindresorhus/slugify'

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
      // All roles with the "stofnun-" prefix need to have their entries tagged in order to manage user permissions
      .filter((role) => role.name.toLowerCase().startsWith('stofnun-'))
      .map((role) => slugify(role.name))

    if (tags.length === 0) {
      return 'Entry creator does not belong to any tag-related role so no tag will be applied to the new entry'
    }

    // TODO: create tags if they don't already exist

    return await this.appRepository.tagEntry(entry, tags)
  }

  async handleEntryCreation(entry: Entry) {
    try {
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
