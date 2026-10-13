import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op, QueryTypes } from 'sequelize'

import { DelegationPreferenceDto } from './dto/delegation-preference.dto'
import { DelegationIndex } from './models/delegation-index.model'
import { DelegationPreference } from './models/delegation-preference.model'

const MAX_RECENT = 10

const MAX_RECENT_ROWS = 20

const CONFLICT_COLUMNS = ['to_national_id', 'from_national_id'] as never[]

@Injectable()
export class DelegationPreferenceService {
  constructor(
    @InjectModel(DelegationPreference)
    private readonly delegationPreferenceModel: typeof DelegationPreference,
    @InjectModel(DelegationIndex)
    private readonly delegationIndexModel: typeof DelegationIndex,
  ) {}

  /**
   * The parties this actor still holds a delegation for, across every client.
   * Null when the actor has no index rows at all, which means they have not
   * been indexed rather than that they hold nothing — the caller then leaves
   * their preferences alone.
   */
  private async liveParties(toNationalId: string): Promise<Set<string> | null> {
    const rows = await this.delegationIndexModel.findAll({
      where: {
        toNationalId,
        [Op.or]: [{ validTo: null }, { validTo: { [Op.gte]: new Date() } }],
      },
      attributes: ['fromNationalId'],
    })

    return rows.length === 0
      ? null
      : new Set(rows.map((row) => row.fromNationalId))
  }

  private static scopeTo(live: Set<string> | null) {
    return live ? { fromNationalId: { [Op.in]: [...live] } } : {}
  }

  async findAll(toNationalId: string): Promise<DelegationPreferenceDto[]> {
    const attributes = ['fromNationalId', 'favouritedAt', 'lastUsedAt'] as const
    const live = await this.liveParties(toNationalId)
    const scope = DelegationPreferenceService.scopeTo(live)

    const [favourites, recent] = await Promise.all([
      this.delegationPreferenceModel.findAll({
        where: { toNationalId, favouritedAt: { [Op.ne]: null }, ...scope },
        attributes: [...attributes],
        order: [['favouritedAt', 'ASC']],
      }),
      this.delegationPreferenceModel.findAll({
        where: { toNationalId, lastUsedAt: { [Op.ne]: null }, ...scope },
        attributes: [...attributes],
        order: [['lastUsedAt', 'DESC']],
        limit: MAX_RECENT,
      }),
    ])

    const byNationalId = new Map<string, DelegationPreferenceDto>()

    for (const preference of [...favourites, ...recent]) {
      byNationalId.set(preference.fromNationalId, {
        fromNationalId: preference.fromNationalId,
        isFavourite: Boolean(preference.favouritedAt),
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
        { favouritedAt: null },
        { where: { toNationalId, fromNationalId } },
      )

      return
    }

    const live = await this.liveParties(toNationalId)

    if (live && !live.has(fromNationalId)) {
      throw new BadRequestException(
        'Cannot favourite a party the user holds no delegation for',
      )
    }

    await this.delegationPreferenceModel.upsert(
      { toNationalId, fromNationalId, favouritedAt: new Date() },
      {
        conflictFields: CONFLICT_COLUMNS,
        fields: ['favouritedAt'],
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
           AND favourited_at IS NULL
           AND last_used_at < (
             SELECT min(last_used_at) FROM (
               SELECT last_used_at FROM delegation_preference
                WHERE to_national_id = :toNationalId
                  AND favourited_at IS NULL
                  AND last_used_at IS NOT NULL
                ORDER BY last_used_at DESC
                LIMIT :keep
             ) AS kept
           )`,
      {
        replacements: { toNationalId, keep: MAX_RECENT_ROWS },
        type: QueryTypes.DELETE,
      },
    )
  }
}
