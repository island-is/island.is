import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op, QueryTypes } from 'sequelize'

import { DelegationPreferenceDto } from './dto/delegation-preference.dto'
import { DelegationPreference } from './models/delegation-preference.model'

// More than the picker shows, to cover parties whose delegation has since been
// revoked and which the screen drops.
const MAX_RECENT = 10

// The picker shows five, and starring a sixth is refused rather than silently
// dropping one.
const MAX_FAVOURITES = 5

// Rows an actor keeps for parties they have switched to but not starred. One
// row per party, never one per switch, but a party whose delegation is later
// revoked would otherwise sit here for good.
const MAX_RECENT_ROWS = 20

// Sequelize drops conflictFields straight into the ON CONFLICT clause without
// mapping them to column names, so these must be the real columns even though
// the typings ask for attribute names. Leaving them out is not an option: it
// then derives the conflict target from the columns being updated, and neither
// of those belongs to the unique key.
const CONFLICT_COLUMNS = ['to_national_id', 'from_national_id'] as never[]

/**
 * Deliberately knows nothing about which delegations actually exist: the screen
 * renders these against the delegation list it has already fetched, so a
 * revoked one simply never shows up. That keeps reads to a single indexed query
 * with no cross service calls.
 */
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
      // A row that carries nothing else goes away; one that still records a
      // use keeps that and only loses the star.
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

    // Touches isFavourite only, so a concurrent switch cannot lose its
    // lastUsedAt.
    await this.delegationPreferenceModel.upsert(
      { toNationalId, fromNationalId, isFavourite: true },
      {
        conflictFields: CONFLICT_COLUMNS,
        fields: ['isFavourite'],
      },
    )
  }

  /**
   * On the login path, so deliberately a single statement: findOrCreate would
   * open a transaction and then write the timestamp a second time.
   */
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

  /**
   * Drops this actor's oldest unstarred rows. Favourites are left alone; they
   * have a cap of their own.
   */
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
