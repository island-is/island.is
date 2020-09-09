import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Counter } from 'prom-client'
import { Sequelize } from 'sequelize-typescript'
import { UserProfile } from './user-profile.model'
import { UserIdentity } from './user-identity.model'
import { UserIdentitiesService } from './user-identities.service'

@Injectable()
export class UserProfilesService {
  applicationsRegistered = new Counter({
    name: 'apps_registered3',
    labelNames: ['res1'],
    help: 'Number of applications',
  }) // TODO: How does this work?

  constructor(
    private sequelize: Sequelize,
    @InjectModel(UserProfile)
    private userProfileModel: typeof UserProfile,
    private userIdentitiesService: UserIdentitiesService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) { }

  async findBySubjectId(subjectId: string): Promise<UserProfile> {
    this.logger.debug(`Finding user profile for subjectId - "${subjectId}"`)

    const identity = await this.userIdentitiesService.findBySubjectId(subjectId)

    if (identity) {
      this.logger.debug(`Found profileId - "${identity.profileId}"`)
  
      return this.userProfileModel.findOne({
        where: { id: identity.profileId },
      })
    }
  }
}
