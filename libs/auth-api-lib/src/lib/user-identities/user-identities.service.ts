import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Claim } from './models/claim.model'
import { Sequelize } from 'sequelize-typescript'
import { UserIdentity } from './models/user-identity.model'
import { UserIdentityDto } from './dto/user-identity.dto'
import { ClaimDto } from './dto/claim.dto'
import { Op } from 'sequelize'

@Injectable()
export class UserIdentitiesService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(UserIdentity)
    private userIdentityModel: typeof UserIdentity,
    @InjectModel(Claim)
    private claimModel: typeof Claim,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  /** Get's all user identities and total count of rows */
  async findAndCountAll(): Promise<{
    rows: UserIdentity[]
    count: number
  } | null> {
    return this.userIdentityModel.findAndCountAll({
      include: [Claim],
      distinct: true,
      useMaster: true,
    })
  }

  /** Creates a new User Identity */
  async create(
    userIdentity: UserIdentityDto,
  ): Promise<UserIdentity | undefined> {
    this.logger.debug(
      `Creating user identity with subjectId - ${userIdentity.subjectId}`,
    )

    try {
      return this.sequelize.transaction((t) => {
        return this.userIdentityModel.create(
          { ...userIdentity },
          {
            include: [Claim],
            transaction: t,
          },
        )
      })
    } catch {
      this.logger.warn('Error when executing transaction, rollbacked.')
    }
  }

  /** Gets a user identity by subjectId */
  async findBySubjectId(subjectId: string): Promise<UserIdentity | null> {
    this.logger.debug(`Finding user identity for subjectId - "${subjectId}"`)

    if (!subjectId) {
      throw new BadRequestException('SubjectId must be provided')
    }

    return await this.userIdentityModel.findByPk(subjectId, {
      include: [Claim],
      useMaster: true,
    })
  }

  /** Get user identity by national national id (kt) */
  async findByNationalId(nationalId: string) {
    if (!nationalId) {
      throw new BadRequestException('NationalId must be provided')
    }

    const linkedIdentity = await this.userIdentityModel.findAll({
      include: [
        {
          model: Claim,
          where: { type: 'nationalId', value: nationalId },
        },
      ],
      useMaster: true,
    })

    if (linkedIdentity) {
      return await this.userIdentityModel.findAll({
        include: [Claim],
        where: { subjectId: linkedIdentity.map((c) => c.subjectId) },
        useMaster: true,
      })
    }

    return null
  }

  /** Gets a user identiy by a provider and subjectid */
  async findByProviderSubjectId(
    provider: string,
    subjectId: string,
  ): Promise<UserIdentity | null> {
    this.logger.debug(
      `Finding user identity for provider "${provider}" and subjectId - "${subjectId}"`,
    )

    if (!provider) {
      throw new BadRequestException('Provider must be provided')
    }

    if (!subjectId) {
      throw new BadRequestException('SubjectId must be provided')
    }

    return this.userIdentityModel.findOne({
      where: { providerName: provider, providerSubjectId: subjectId },
      include: [Claim],
      useMaster: true,
    })
  }

  /** Gets a delegation identity by a provider, subjectid and actor subject id */
  async findDelegationIdentity(
    provider: string,
    subjectId: string,
    actorSubjectId: string,
  ): Promise<UserIdentity | null> {
    this.logger.debug(
      `Finding user identity for provider "${provider}", subjectId - "${subjectId}" and actorSubjectId - "${actorSubjectId}"`,
    )

    if (!provider) {
      throw new BadRequestException('Provider must be provided')
    }

    if (!subjectId) {
      throw new BadRequestException('SubjectId must be provided')
    }

    if (!actorSubjectId) {
      throw new BadRequestException('Actor SubjectId must be provided')
    }

    const result = await this.sequelize.query(
      `select subject_id from user_identity
        where provider_name = $provider and provider_subject_id = $subjectId
        and exists (select 0 from claim where claim.subject_id = user_identity.subject_id
          and "type" = 'actorSubjectId' and "value" = $actorSubjectId)`,
      {
        bind: {
          provider: provider,
          subjectId: subjectId,
          actorSubjectId: actorSubjectId,
        },
        plain: true,
        useMaster: true,
      },
    )

    if (result) {
      return await this.findBySubjectId(result.subject_id as string)
    } else {
      return null
    }
  }

  /** Updates an existing user identity */
  async update(userIdentity: UserIdentityDto): Promise<UserIdentity | null> {
    this.logger.debug(
      'Updating the user identity with subjectId: ',
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
    this.logger.debug('Deleting user identity with subjectId: ', subjectId)

    if (!subjectId) {
      throw new BadRequestException('SubjectId must be provided')
    }

    return await this.userIdentityModel.destroy({
      where: { subjectId: subjectId },
    })
  }

  /** Activates or deactivates a user by it's subjectId */
  async setActive(
    subjectId: string,
    active: boolean,
  ): Promise<UserIdentity | null> {
    this.logger.debug(`Set subjectId: ${subjectId} as active: ${active}`)

    if (!subjectId) {
      throw new BadRequestException('SubjectId must be provided')
    }

    const sub = await this.userIdentityModel.findByPk(subjectId, {
      useMaster: true,
    })
    if (sub) {
      sub.active = active

      return sub.save()
    }

    return null
  }

  async updateClaims(
    subjectId: string,
    claims: ClaimDto[],
  ): Promise<ClaimDto[]> {
    await this.sequelize.transaction(async (t) => {
      await this.claimModel.destroy({
        where: { subjectId, type: { [Op.notIn]: claims.map((c) => c.type) } },
        transaction: t,
      })

      await this.claimModel.bulkCreate(
        claims.map((c) => ({
          subjectId,
          type: c.type,
          value: c.value,
          valueType: c.valueType,
          issuer: c.issuer,
          originalIssuer: c.originalIssuer,
        })),
        {
          transaction: t,
          updateOnDuplicate: ['value', 'valueType', 'issuer', 'originalIssuer'],
        },
      )
    })

    return claims
  }
}
