import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'

import { DelegationPreferenceDto } from './dto/delegation-preference.dto'
import { DelegationPreference } from './models/delegation-preference.model'

/**
 * How many recently used parties a read returns. The picker shows fewer than
 * this; the surplus covers parties whose delegation has since been revoked and
 * which the screen therefore drops.
 */
const MAX_RECENT = 10

/**
 * Nothing here checks that a delegation actually exists (see the class comment),
 * so without a cap an actor could star arbitrarily many parties and grow both
 * the table and every subsequent read. Far above what anyone holds in practice.
 */
const MAX_FAVOURITES = 100

/**
 * Favourites and last used, for the "Veldu notanda" screen.
 *
 * Deliberately knows nothing about which delegations actually exist: the screen
 * renders these against the delegation list it has already fetched, so a
 * preference for a delegation that has since been revoked simply never shows
 * up. That keeps reads to a single indexed query with no cross service calls.
 */
@Injectable()
export class DelegationPreferenceService {
  constructor(
    @InjectModel(DelegationPreference)
    private readonly delegationPreferenceModel: typeof DelegationPreference,
  ) {}

  /**
   * Everything the picker can display and nothing more: the starred parties,
   * and the most recently used ones. An actor who has switched between many
   * parties over the years still reads a bounded number of rows.
   */
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

    // A party can be both starred and recently used, and must appear once.
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
      // Unstarring is not worth a row of its own. One that carries nothing else
      // goes away; one that still records a use keeps that and loses the star.
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
    // lastUsedAt, and the whole write is one round trip.
    await this.delegationPreferenceModel.upsert(
      { toNationalId, fromNationalId, isFavourite: true },
      {
        conflictFields: ['toNationalId', 'fromNationalId'],
        fields: ['isFavourite'],
      },
    )
  }

  /**
   * Called when the actor actually switches to a party. Leaves isFavourite
   * alone — a row may already exist because the party is starred.
   *
   * On the login path, so it is deliberately a single statement: findOrCreate
   * would open a transaction and then write the timestamp a second time.
   */
  async recordUsage(
    toNationalId: string,
    fromNationalId: string,
  ): Promise<void> {
    await this.delegationPreferenceModel.upsert(
      { toNationalId, fromNationalId, lastUsedAt: new Date() },
      {
        conflictFields: ['toNationalId', 'fromNationalId'],
        fields: ['lastUsedAt'],
      },
    )
  }
}
