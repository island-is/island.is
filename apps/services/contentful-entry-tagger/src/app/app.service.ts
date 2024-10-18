import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { AppRepository } from './app.repository'
import slugify from '@sindresorhus/slugify'
import type { Entry, Role, Team } from 'contentful-management'

const TAGGABLE_ENTRY_PREFIX = 'owner-'

const extractTagNamesFromGroup = (group: Role | Team) =>
  group.name.toLowerCase().startsWith(TAGGABLE_ENTRY_PREFIX)

@Injectable()
export class AppService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly appRepository: AppRepository,
  ) {}

  async tagEntry(entry: Entry) {
    const userId = entry.sys.createdBy?.sys.id as string
    const [roles, teams] = await Promise.all([
      this.appRepository.getUserSpaceRoles(userId),
      this.appRepository.getUserTeams(userId),
    ])

    const rolesThatMatch = roles.filter(extractTagNamesFromGroup)
    const teamsThatMatch = teams.filter(extractTagNamesFromGroup)

    let tags: string[] = []

    if (rolesThatMatch.length > 0) {
      tags = rolesThatMatch.map((role) => slugify(role.name))
    } else if (teamsThatMatch.length > 0) {
      tags = teamsThatMatch.map((team) => slugify(team.name))
    }

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
