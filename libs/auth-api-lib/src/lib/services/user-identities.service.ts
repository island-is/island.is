import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Claim } from '../entities/models/claim.model'
import { Sequelize } from 'sequelize-typescript'
import { UserIdentity } from '../entities/models/user-identity.model'
import { UserIdentityDto } from '../entities/dto/user-identity.dto'

@Injectable()
export class UserIdentitiesService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(UserIdentity)
    private userIdentityModel: typeof UserIdentity,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  /** Creates a new User Identity */
  async create(userIdentity: UserIdentityDto): Promise<UserIdentity> {
    this.logger.debug(
      `Creating user identity with subjectId - ${userIdentity.subjectId}`,
    )

    try {
      return this.sequelize.transaction((t) => {
        return this.userIdentityModel.create(userIdentity, {
          include: [Claim],
          transaction: t,
        })
      })
    } catch {
      this.logger.warn('Error when executing transaction, rollbacked.')
    }
  }

  /** Gets a user identity by subject id */
  async findBySubjectId(subjectId: string): Promise<UserIdentity> {
    this.logger.debug(`Finding user identity for subjectId - "${subjectId}"`)

    if (!subjectId) {
      throw new BadRequestException('SubjectId must be provided')
    }

    return await this.userIdentityModel.findOne({
      where: { subjectId },
      include: [Claim],
    })
  }

  /** Gets a user identiy by a provider and subjectid */
  async findByProviderSubjectId(
    provider: string,
    subjectId: string,
  ): Promise<UserIdentity> {
    this.logger.debug(
      `Finding user identity for provider "${provider}" and subjectId - "${subjectId}"`,
    )

    if (!provider) {
      throw new BadRequestException('Provider must be provided')
    }

    return this.userIdentityModel.findOne({
      where: { providerName: provider, providerSubjectId: subjectId },
      include: [Claim],
    })
  }

  /** Updates an existing user identity */
  async update(userIdentity: UserIdentityDto): Promise<UserIdentity> {
    this.logger.debug(
      'Updating the user identity with id: ',
      userIdentity.subjectId,
    )

    await this.userIdentityModel.update(
      { ...userIdentity },
      {
        where: { subjectId: userIdentity.subjectId },
      },
    )

    return await this.findBySubjectId(userIdentity.subjectId)
  }

  /** Deletes an user identity by subjectid */
  async delete(subjectId: string): Promise<number> {
    this.logger.debug('Deleting user identity with id: ', subjectId)

    if (!subjectId) {
      throw new BadRequestException('SubjectId must be provided')
    }

    return await this.userIdentityModel.destroy({
      where: { subjectId: subjectId },
    })
  }
}
