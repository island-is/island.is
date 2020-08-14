import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Counter } from 'prom-client'
import { Sequelize } from 'sequelize-typescript'
import { UserProfile } from './user-profile.model'

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
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}


  async findBySubjectId(subjectId: string): Promise<UserProfile> {
    this.logger.debug(`Finding user profile for subjectId - "${subjectId}"`)

    const [result, meta] = await this.sequelize.query('SELECT "profile_id" FROM "user_identity" WHERE subject_id=$subjectId',
    {
        bind: { subjectId: subjectId},
        // type: this.sequelize.QueryTypes.SELECT
    });
    const profileId = result.map(i => i.profile_id);

    this.logger.debug(`Found profile id - "${profileId}"`)

    return this.userProfileModel.findOne({
      where: { id: profileId },
    })
  }

}
