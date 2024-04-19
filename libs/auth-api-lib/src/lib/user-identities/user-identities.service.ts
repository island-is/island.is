import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { randomBytes } from 'crypto'
import { Op } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import { ClaimDto } from './dto/claim.dto'
import { UserIdentityDto } from './dto/user-identity.dto'
import { Claim } from './models/claim.model'
import { UserIdentity } from './models/user-identity.model'

export const audkenniProvider = 'audkenni'
export const delegationProvider = 'delegation'
export const actorSubjectIdType = 'actorSubjectId'

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

  /** Gets all user identities and total count of rows */
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

  /** Get user identity by national id (kt) */
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

  /** Gets a user identity by a provider and subjectId */
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

  /** Gets a delegation identity by a provider, subjectId and actor subjectId */
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

  /** Deletes a user identity by subjectId */
  async delete(subjectId: string): Promise<number> {
    this.logger.debug('Deleting user identity with subjectId: ', subjectId)

    if (!subjectId) {
      throw new BadRequestException('SubjectId must be provided')
    }

    return await this.userIdentityModel.destroy({
      where: { subjectId: subjectId },
    })
  }

  /** Activates or deactivates a user by its subjectId */
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

  async findOrCreateSubjectId({
    toNationalId,
    fromNationalId,
  }: {
    fromNationalId: string
    toNationalId: string
  }): Promise<string | null> {
    const actor = await this.findUserIdentity({
      nationalId: toNationalId,
      provider: audkenniProvider,
    })

    if (!actor) {
      throw new NotFoundException('Actor not found')
    }

    const delegation = await this.findUserIdentity({
      nationalId: fromNationalId,
      provider: delegationProvider,
      claim: { type: actorSubjectIdType, value: actor.subjectId },
    })

    if (delegation) {
      return delegation.subjectId
    } else {
      return await this.autoProvisionDelegation(fromNationalId, actor)
    }
  }

  private findUserIdentity({
    nationalId,
    provider,
    claim,
  }: {
    nationalId: string
    provider: string
    claim?: {
      type: string
      value: string
    }
  }): Promise<UserIdentity | null> {
    return this.userIdentityModel.findOne({
      where: {
        providerName: provider,
        providerSubjectId: `IS-${nationalId}`,
      },
      ...(claim && {
        include: [
          {
            model: Claim,
            where: { type: claim.type, value: claim.value },
          },
        ],
      }),
    })
  }

  private async autoProvisionDelegation(
    fromNationalId: string,
    actor: UserIdentity,
  ): Promise<string | null> {
    const subjectId = this.generateSubjectId()

    const delegation: UserIdentityDto = {
      subjectId,
      name: '-', // the name column should not be in use anywhere
      providerName: delegationProvider,
      providerSubjectId: `IS-${fromNationalId}`,
      active: true,
      claims: [
        {
          type: actorSubjectIdType,
          value: actor.subjectId,
          valueType: 'http://www.w3.org/2001/XMLSchema#string',
          issuer: 'delegationindex',
          originalIssuer: 'delegationindex',
        },
      ], // claims will be updated when the delegation is used
    }

    const createdDelegation = await this.create(delegation)

    return createdDelegation?.subjectId ?? null
  }

  private generateSubjectId(): string {
    return randomBytes(32).toString('hex').toUpperCase()
  }
}
