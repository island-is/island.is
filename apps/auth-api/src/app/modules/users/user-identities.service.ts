import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { UserIdentity } from './models/user-identity.model'
import { UserIdentityDto } from './dto/user-identity.dto'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Counter } from 'prom-client'
import { Claim } from './models/claim.model'
import { Sequelize } from 'sequelize-typescript'

@Injectable()
export class UserIdentitiesService {
  applicationsRegistered = new Counter({
    name: 'apps_registered2',
    labelNames: ['res1'],
    help: 'Number of applications',
  }) // TODO: How does this work?

  constructor(
    private sequelize: Sequelize,
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
    try {
      // TODO: Attach existing profile if exists and is appropriate (based on provider trust)
      return this.sequelize.transaction(t => {
        return this.userIdentityModel.create(userIdentity, {include: [Claim], transaction: t})
      })
    } catch {
      // rollbacked
    }
  }

  async getById(id: string): Promise<UserIdentity> {
    this.logger.debug('Getting user identity data for id: ', id)

    return this.userIdentityModel.findOne({
      where: { id: id },
    })
  }

  async findBySubjectId(subjectId: string): Promise<UserIdentity> {
    this.logger.debug(`Finding user identity for subjectId - "${subjectId}"`)
    return await this.userIdentityModel.findOne({
      where: { subjectId },
      include: [Claim]
    })
  }

  // private async findExistingProfile()

  async findByProviderSubjectId(provider: string, subjectId: string): Promise<UserIdentity> {
    this.logger.debug(`Finding user identity for provider "$(provider)" and subjectId - "${subjectId}"`)
    return await this.userIdentityModel.findOne({
      where: { providerName: provider, providerSubjectId: subjectId },
      include: [Claim]
    })
  }

  async update(
    userIdentity: UserIdentityDto,
    id: string,
  ): Promise<UserIdentity> {
    this.logger.debug('Updating the user identity with id: ', id)

    await this.userIdentityModel.update(
      { ...userIdentity },
      {
        where: { id: id },
      },
    )

    return await this.getById(id)
  }

  async delete(
    id: string,
  ): Promise<number> {
    this.logger.debug('Deleting user identity with id: ', id)

    return await this.userIdentityModel.destroy({
      where: { id: id}
    })
  }
}
