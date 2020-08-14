import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { UserIdentity } from './user-identity.model'
import { UserIdentityDto } from './dto/user-identity.dto'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Counter } from 'prom-client'

@Injectable()
export class UserIdentityService {
  applicationsRegistered = new Counter({
    name: 'apps_registered2',
    labelNames: ['res1'],
    help: 'Number of applications',
  }) // TODO: How does this work?

  constructor(
    @InjectModel(UserIdentity)
    private userIdentityModel: typeof UserIdentity,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async create(userIdentity: UserIdentityDto): Promise<UserIdentity> {
    this.logger.debug(
      `Creating user identity with subjectIdId - ${userIdentity.subjectId}`,
    )
    this.applicationsRegistered.labels('res1').inc()
    return this.userIdentityModel.create(userIdentity)
  }

  async findBySubjectId(subjectId: string): Promise<UserIdentity> {
    this.logger.debug(`Finding user identity for subjectId - "${subjectId}"`)
    return this.userIdentityModel.findOne({
      where: { subjectId },
    })
  }
}
