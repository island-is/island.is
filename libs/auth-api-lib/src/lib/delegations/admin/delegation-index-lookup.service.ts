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
import { DelegationTypeModel } from '../models/delegation-type.model'

export interface IndexedDelegation {
  record: DelegationIndex
  /** The type as stored, e.g. `PersonalRepresentative:postholf`. */
  storedType: string
  type: AuthDelegationType
  provider: AuthDelegationProvider
  /** Index records have no id, so one is derived from the record's key. */
  id: string
  /** Company and ward delegations are only indexed in the recipient's full reindex. */
  indexedAt: Date | null
}

@Injectable()
export class DelegationIndexLookupService {
  constructor(
    @InjectModel(DelegationIndex)
    private delegationIndexModel: typeof DelegationIndex,
    @InjectModel(DelegationIndexMeta)
    private delegationIndexMetaModel: typeof DelegationIndexMeta,
    @InjectModel(DelegationTypeModel)
    private delegationTypeModel: typeof DelegationTypeModel,
  ) {}

  async findByNationalId(
    nationalId: string,
    excludeTypes: AuthDelegationType[],
  ): Promise<IndexedDelegation[]> {
    const indexRecords = await this.delegationIndexModel.findAll({
      where: {
        [Op.or]: [{ toNationalId: nationalId }, { fromNationalId: nationalId }],
        type: { [Op.notIn]: excludeTypes },
      },
    })
    const records = await this.withCurrentProvider(indexRecords)

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
      id: `${record.type}_${record.provider}_${record.toNationalId}_${record.fromNationalId}`,
      indexedAt: indexedAt.get(record.toNationalId) ?? null,
    }))
  }

  /** Records from a provider a delegation type has moved away from are stale. */
  private async withCurrentProvider(
    records: DelegationIndex[],
  ): Promise<DelegationIndex[]> {
    if (records.length === 0) {
      return []
    }

    const types = await this.delegationTypeModel.findAll({
      where: { id: uniq(records.map((r) => r.type)) },
      attributes: ['id', 'providerId'],
    })
    const providerByType = new Map(types.map((t) => [t.id, t.providerId]))

    return records.filter((r) => providerByType.get(r.type) === r.provider)
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
