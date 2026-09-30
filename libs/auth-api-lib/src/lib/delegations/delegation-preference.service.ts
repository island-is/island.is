import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op, QueryTypes } from 'sequelize'

import { DelegationPreferenceDto } from './dto/delegation-preference.dto'
import { DelegationPreference } from './models/delegation-preference.model'

const MAX_RECENT = 10

const MAX_FAVOURITES = 5

const MAX_RECENT_ROWS = 20

const CONFLICT_COLUMNS = ['to_national_id', 'from_national_id'] as never[]

@Injectable()
export class DelegationPreferenceService {
  constructor(
    @InjectModel(DelegationPreference)
    private readonly delegationPreferenceModel: typeof DelegationPreference,
  ) {}

  async findAll(toNationalId: string): Promise<DelegationPreferenceDto[]> {
    const attributes = ['fromNationalId', 'isFavourite', 'lastUsedAt'] as const

    const [favourites, recent] = await Promise.all([
      this.delegationPreferenceModel.findAll({
        where: { toNationalId, isFavourite: true },
        attributes: [...attributes],
        limit: MAX_FAVOURITES,
      }),
      this.delegationPreferenceModel.findAll({
        where: { toNationalId, lastUsedAt: { [Op.ne]: null } },
        attributes: [...attributes],
        order: [['lastUsedAt', 'DESC']],
        limit: MAX_RECENT,
      }),
    ])

    const byNationalId = new Map<string, DelegationPreferenceDto>()

    for (const preference of [...favourites, ...recent]) {
      byNationalId.set(preference.fromNationalId, {
        fromNationalId: preference.fromNationalId,
        isFavourite: preference.isFavourite,
        lastUsedAt: preference.lastUsedAt ?? null,
      })
    }

    return [...byNationalId.values()]
  }

  async setFavourite(
    toNationalId: string,
    fromNationalId: string,
    isFavourite: boolean,
  ): Promise<void> {
    if (!isFavourite) {
      await this.delegationPreferenceModel.destroy({
        where: { toNationalId, fromNationalId, lastUsedAt: null },
      })

      await this.delegationPreferenceModel.update(
        { isFavourite: false },
        { where: { toNationalId, fromNationalId } },
      )

      return
    }

    const favourites = await this.delegationPreferenceModel.count({
      where: { toNationalId, isFavourite: true },
    })

    if (favourites >= MAX_FAVOURITES) {
      throw new BadRequestException(
        `Cannot have more than ${MAX_FAVOURITES} favourite delegations`,
      )
    }

    await this.delegationPreferenceModel.upsert(
      { toNationalId, fromNationalId, isFavourite: true },
      {
        conflictFields: CONFLICT_COLUMNS,
        fields: ['isFavourite'],
      },
    )
  }

  async recordUsage(
    toNationalId: string,
    fromNationalId: string,
  ): Promise<void> {
    await this.delegationPreferenceModel.upsert(
      { toNationalId, fromNationalId, lastUsedAt: new Date() },
      {
        conflictFields: CONFLICT_COLUMNS,
        fields: ['lastUsedAt'],
      },
    )

    await this.pruneRecent(toNationalId)
  }

  private async pruneRecent(toNationalId: string): Promise<void> {
    await this.delegationPreferenceModel.sequelize?.query(
      `DELETE FROM delegation_preference
         WHERE to_national_id = :toNationalId
           AND is_favourite = false
           AND id NOT IN (
             SELECT id FROM delegation_preference
              WHERE to_national_id = :toNationalId
                AND is_favourite = false
              ORDER BY last_used_at DESC NULLS LAST
              LIMIT :keep
           )`,
      {
        replacements: { toNationalId, keep: MAX_RECENT_ROWS },
        type: QueryTypes.DELETE,
      },
    )
  }
}
