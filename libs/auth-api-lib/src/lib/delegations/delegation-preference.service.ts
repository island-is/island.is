import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { DelegationPreferenceDto } from './dto/delegation-preference.dto'
import { DelegationPreference } from './models/delegation-preference.model'

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

  async findAll(toNationalId: string): Promise<DelegationPreferenceDto[]> {
    const preferences = await this.delegationPreferenceModel.findAll({
      where: { toNationalId },
      attributes: ['fromNationalId', 'isFavourite', 'lastUsedAt'],
    })

    return preferences.map((preference) => ({
      fromNationalId: preference.fromNationalId,
      isFavourite: preference.isFavourite,
      lastUsedAt: preference.lastUsedAt ?? null,
    }))
  }

  async setFavourite(
    toNationalId: string,
    fromNationalId: string,
    isFavourite: boolean,
  ): Promise<void> {
    const [preference] = await this.delegationPreferenceModel.findOrCreate({
      where: { toNationalId, fromNationalId },
      defaults: { toNationalId, fromNationalId, isFavourite },
    })

    if (preference.isFavourite !== isFavourite) {
      await preference.update({ isFavourite })
    }
  }

  /**
   * Called when the actor actually switches to a party. Leaves isFavourite
   * alone — a row may already exist because the party is starred.
   */
  async recordUsage(
    toNationalId: string,
    fromNationalId: string,
  ): Promise<void> {
    const [preference] = await this.delegationPreferenceModel.findOrCreate({
      where: { toNationalId, fromNationalId },
      defaults: { toNationalId, fromNationalId, lastUsedAt: new Date() },
    })

    await preference.update({ lastUsedAt: new Date() })
  }
}
