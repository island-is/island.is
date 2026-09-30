import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op, QueryTypes } from 'sequelize'

import { DelegationPreferenceDto } from './dto/delegation-preference.dto'
import { DelegationIndex } from './models/delegation-index.model'
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
    const attributes = ['fromNationalId', 'isFavourite', 'lastUsedAt'] as const
    const live = await this.liveParties(toNationalId)
    const scope = DelegationPreferenceService.scopeTo(live)

    const [favourites, recent] = await Promise.all([
      this.delegationPreferenceModel.findAll({
        where: { toNationalId, isFavourite: true, ...scope },
        attributes: [...attributes],
        order: [['created', 'ASC']],
        limit: MAX_FAVOURITES,
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

    const live = await this.liveParties(toNationalId)
    const sequelize = this.delegationPreferenceModel.sequelize

    await sequelize?.transaction(async (transaction) => {
      /**
       * Counting and then writing is two statements, so without this two
       * requests could both see room and both add one. The lock is keyed on the
       * actor, so it only ever serialises one person's own favourites.
       */
      await sequelize.query('SELECT pg_advisory_xact_lock(hashtext(:key))', {
        replacements: { key: `delegation_preference:${toNationalId}` },
        type: QueryTypes.SELECT,
        transaction,
      })

      /**
       * The party being starred is left out of the count, so re-starring one
       * that is already a favourite stays idempotent at the cap rather than
       * being refused.
       */
      const others = await this.delegationPreferenceModel.count({
        where: {
          toNationalId,
          isFavourite: true,
          fromNationalId: {
            [Op.ne]: fromNationalId,
            ...(live ? { [Op.in]: [...live] } : {}),
          },
        },
        transaction,
      })

      if (others >= MAX_FAVOURITES) {
        throw new BadRequestException(
          `Cannot have more than ${MAX_FAVOURITES} favourite delegations`,
        )
      }

      await this.delegationPreferenceModel.upsert(
        { toNationalId, fromNationalId, isFavourite: true },
        {
          conflictFields: CONFLICT_COLUMNS,
          fields: ['isFavourite'],
          transaction,
        },
      )
    })
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
    /**
     * Deleting by timestamp rather than by id: under READ COMMITTED the
     * subquery runs against the snapshot taken when the statement started, so
     * picking ids to drop could delete a row that a concurrent switch has just
     * refreshed. A refreshed row carries a new timestamp and so falls outside
     * the threshold instead.
     */
    await this.delegationPreferenceModel.sequelize?.query(
      `DELETE FROM delegation_preference
         WHERE to_national_id = :toNationalId
           AND is_favourite = false
           AND last_used_at < (
             SELECT min(last_used_at) FROM (
               SELECT last_used_at FROM delegation_preference
                WHERE to_national_id = :toNationalId
                  AND is_favourite = false
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
