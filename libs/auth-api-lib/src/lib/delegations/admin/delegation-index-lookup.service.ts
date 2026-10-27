import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import uniq from 'lodash/uniq'
import { Op } from 'sequelize'

import {
  AuthDelegationProvider,
  AuthDelegationType,
  isPersonalRepresentativeDelegationType,
} from '@island.is/shared/types'

import { DelegationIndexMeta } from '../models/delegation-index-meta.model'
import { DelegationIndex } from '../models/delegation-index.model'

export interface IndexedDelegation {
  record: DelegationIndex
  /** The type as stored, e.g. `PersonalRepresentative:postholf`. */
  storedType: string
  /** The type with personal representative rights collapsed. */
  type: AuthDelegationType
  provider: AuthDelegationProvider
  /** Index records have no id, so one is derived from the record's key. */
  id: string
  /**
   * When the recipient's delegations were last fully reindexed, null if never.
   * Company and ward delegations are only written by a full reindex, which
   * happens when the recipient logs in, so this tells how fresh they are.
   */
  indexedAt: Date | null
}

/**
 * Reads a person's delegations from the delegation index for admin lookups.
 *
 * The index is best effort, see `indexedAt`.
 */
@Injectable()
export class DelegationIndexLookupService {
  constructor(
    @InjectModel(DelegationIndex)
    private delegationIndexModel: typeof DelegationIndex,
    @InjectModel(DelegationIndexMeta)
    private delegationIndexMetaModel: typeof DelegationIndexMeta,
  ) {}

  async findByNationalId(
    nationalId: string,
    excludeTypes: AuthDelegationType[],
  ): Promise<IndexedDelegation[]> {
    const records = await this.delegationIndexModel.findAll({
      where: {
        [Op.or]: [{ toNationalId: nationalId }, { fromNationalId: nationalId }],
        type: { [Op.notIn]: excludeTypes },
      },
    })

    const indexedAt = await this.findLastFullReindex(
      uniq(records.map((r) => r.toNationalId)),
    )

    return records.map((record) => ({
      record,
      storedType: record.type,
      type: isPersonalRepresentativeDelegationType(record.type)
        ? AuthDelegationType.PersonalRepresentative
        : (record.type as AuthDelegationType),
      provider: record.provider as AuthDelegationProvider,
      id: `${record.type}_${record.toNationalId}_${record.fromNationalId}`,
      indexedAt: indexedAt.get(record.toNationalId) ?? null,
    }))
  }

  private async findLastFullReindex(
    nationalIds: string[],
  ): Promise<Map<string, Date>> {
    if (nationalIds.length === 0) {
      return new Map()
    }

    const meta = await this.delegationIndexMetaModel.findAll({
      where: { nationalId: nationalIds },
      attributes: ['nationalId', 'lastFullReindex'],
    })

    return new Map(
      meta.flatMap((m) =>
        m.lastFullReindex ? [[m.nationalId, m.lastFullReindex]] : [],
      ),
    )
  }
}
