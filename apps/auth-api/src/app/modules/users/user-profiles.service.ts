import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Counter } from 'prom-client'
import { Sequelize } from 'sequelize-typescript'
import { UserProfile } from './models/user-profile.model'
import { UserIdentity } from './models/user-identity.model'
import { UserIdentitiesService } from './user-identities.service'
import { UserProfileDto } from './dto/user-profile.dto'

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
  ) {}

  async getById(id: string): Promise<UserProfile> {
    this.logger.debug('Getting user profile data for id: ', id)

    return this.userProfileModel.findOne({
      where: { id: id },
    })
  }

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

  async create(userProfile: UserProfileDto): Promise<UserProfile> {
    this.logger.debug('Creating a new userProfile')

    return await this.userProfileModel.create({ ...userProfile })
  }

  async update(
    userProfile: UserProfileDto,
    userProfileId: string,
  ): Promise<UserProfile> {
    this.logger.debug('Updating the userProfile with id: ', userProfileId)

    await this.userProfileModel.update(
      { ...userProfile },
      {
        where: { id: userProfileId },
      },
    )

    return await this.getById(userProfileId)
  }

  async delete(id: string): Promise<number> {
    this.logger.debug('Deleting the user profile with id: ', id)

    return await this.userProfileModel.destroy({
      where: { id: id}
    })
  }
}
