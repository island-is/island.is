import { Injectable } from '@nestjs/common'
import { DelegationsIncomingCustomService } from './delegations-incoming-custom.service'
import { User } from '@island.is/auth-nest-tools'
import { DelegationIndex } from './models/delegation-index.model'
import { InjectModel } from '@nestjs/sequelize'
import { DelegationIndexMeta } from './models/delegation-index-meta.model'
import { DelegationDTO, DelegationProvider } from './dto/delegation.dto'
import { DelegationType } from './types/delegationType'
import { DelegationsIncomingRepresentativeService } from './delegations-incoming-representative.service'
import { IncomingDelegationsCompanyService } from './delegations-incoming-company.service'
import { DelegationsIncomingWardService } from './delegations-incoming-ward.service'

const TEN_MINUTES = 1000 * 60 * 10
const ONE_WEEK = 1000 * 60 * 60 * 24 * 7

export type DelegationIndexInfo = Pick<
  DelegationIndex,
  | 'toNationalId'
  | 'fromNationalId'
  | 'provider'
  | 'type'
  | 'validTo'
  | 'customDelegationScopes'
>

type SortedDelegations = {
  created: DelegationIndexInfo[]
  updated: DelegationIndexInfo[]
  deleted: DelegationIndexInfo[]
}

const hasAllSameScopes = (
  a: string[] | undefined,
  b: string[] | undefined,
): boolean => {
  // Only custom delegations have scopes and they are never undefined
  if (!a && !b) {
    return true
  }

  if (!a || !b) {
    return false
  }

  if (a.length !== b.length) {
    return false
  }

  return a.every((s) => b.includes(s))
}

const toDelegationIndexInfo = (
  delegation: DelegationDTO,
): DelegationIndexInfo => ({
  fromNationalId: delegation.fromNationalId,
  toNationalId: delegation.toNationalId,
  type: delegation.type,
  provider: delegation.provider,
  validTo: delegation.validTo,
  customDelegationScopes: delegation.scopes?.map((s) => s.scopeName),
})

/**
 * Service class for delegation index.
 * Delegation index stores delegations for a user
 * to bypass the need to fetch them from third party services
 * */
@Injectable()
export class DelegationsIndexService {
  constructor(
    @InjectModel(DelegationIndex)
    private delegationIndexModel: typeof DelegationIndex,
    @InjectModel(DelegationIndexMeta)
    private delegationIndexMetaModel: typeof DelegationIndexMeta,
    private delegationsIncomingCustomService: DelegationsIncomingCustomService,
    private delegationsIncomingRepresentativeService: DelegationsIncomingRepresentativeService,
    private delegationsIncomingCompanyService: IncomingDelegationsCompanyService,
    private delegationsIncomingWardService: DelegationsIncomingWardService,
  ) {}

  /* Index all incoming delegations */
  async indexDelegations(user: User) {
    const now = new Date().getTime()

    const meta = await this.delegationIndexMetaModel.findOne({
      where: {
        nationalId: user.nationalId,
      },
      attributes: ['nextReindex'],
    })

    // if we have a next reindex date, and it is in the future, we don't need to reindex
    if (
      meta &&
      meta.nextReindex &&
      new Date(meta.nextReindex).getTime() > now
    ) {
      return
    }

    // set next reindex 10 minutes in the future
    await this.delegationIndexMetaModel.upsert({
      nationalId: user.nationalId,
      nextReindex: new Date(now + TEN_MINUTES),
    })

    const delegations = await Promise.all([
      this.getCustomDelegations(user.nationalId),
      this.getRepresentativeDelegations(user.nationalId),
      this.getCompanyDelegations(user),
      this.getWardDelegations(user),
    ]).then((d) =>
      d.reduce(
        (acc, curr) => {
          return {
            created: acc.created.concat(curr.created),
            updated: acc.updated.concat(curr.updated),
            deleted: acc.deleted.concat(curr.deleted),
          }
        },
        {
          created: [],
          updated: [],
          deleted: [],
        } as SortedDelegations,
      ),
    )

    await this.saveToIndex(delegations)

    // set next reindex to one week in the future
    await this.delegationIndexMetaModel.update(
      {
        nextReindex: new Date(now + ONE_WEEK),
        lastFullReindex: new Date(),
      },
      {
        where: {
          nationalId: user.nationalId,
        },
      },
    )
  }

  /* Index incoming custom delegations */
  async indexCustomDelegations(nationalId: string) {
    const delegations = await this.getCustomDelegations(nationalId)
    await this.saveToIndex(delegations)
  }

  /* Index incoming personal representative delegations */
  async indexRepresentativeDelegations(nationalId: string) {
    const delegations = await this.getRepresentativeDelegations(nationalId)
    await this.saveToIndex(delegations)
  }

  /*
   * Private methods
   * */
  private async saveToIndex({ created, updated, deleted }: SortedDelegations) {
    await Promise.all([
      this.delegationIndexModel.bulkCreate(created),
      updated.map((d) =>
        this.delegationIndexModel.update(d, {
          where: {
            fromNationalId: d.fromNationalId,
            toNationalId: d.toNationalId,
            provider: d.provider,
            type: d.type,
          },
        }),
      ),
      deleted.map((d) =>
        this.delegationIndexModel.destroy({
          where: {
            fromNationalId: d.fromNationalId,
            toNationalId: d.toNationalId,
            provider: d.provider,
            type: d.type,
          },
        }),
      ),
    ])
  }

  private sortDelegation(
    currItems: DelegationIndex[],
    newItems: DelegationIndexInfo[],
  ): SortedDelegations {
    const { created, updated } = newItems.reduce(
      (acc, curr) => {
        const existing = currItems.find(
          (d) => d.fromNationalId === curr.fromNationalId,
        )

        if (existing) {
          if (
            existing.validTo !== curr.validTo ||
            !hasAllSameScopes(
              existing.customDelegationScopes,
              curr.customDelegationScopes,
            )
          ) {
            acc.updated.push(curr)
          }
        } else {
          acc.created.push(curr)
        }

        return acc
      },
      { created: [], updated: [] } as {
        created: DelegationIndexInfo[]
        updated: DelegationIndexInfo[]
      },
    )

    const deleted = currItems.filter(
      (delegation) =>
        !newItems.some((d) => d.fromNationalId === delegation.fromNationalId),
    )

    return { deleted, created, updated }
  }

  private async getCustomDelegations(nationalId: string) {
    const delegations = await this.delegationsIncomingCustomService
      .findAllValidIncoming({ nationalId }, true)
      .then((d) => d.map(toDelegationIndexInfo))

    const currentDelegationIndexItems = await this.delegationIndexModel.findAll(
      {
        where: {
          toNationalId: nationalId,
          type: DelegationType.Custom,
          provider: DelegationProvider.Custom,
        },
      },
    )

    return this.sortDelegation(currentDelegationIndexItems, delegations)
  }

  private async getRepresentativeDelegations(nationalId: string) {
    const delegations = await this.delegationsIncomingRepresentativeService
      .findAllIncoming({ nationalId }, true)
      .then((d) => d.map(toDelegationIndexInfo))

    const currentDelegationIndexItems = await this.delegationIndexModel.findAll(
      {
        where: {
          toNationalId: nationalId,
          type: DelegationType.PersonalRepresentative,
          provider: DelegationProvider.PersonalRepresentativeRegistry,
        },
      },
    )

    return this.sortDelegation(currentDelegationIndexItems, delegations)
  }

  private async getCompanyDelegations(user: User) {
    const delegations = await this.delegationsIncomingCompanyService
      .findAllIncoming(user)
      .then((d) => d.map(toDelegationIndexInfo))

    const currentDelegationIndexItems = await this.delegationIndexModel.findAll(
      {
        where: {
          toNationalId: user.nationalId,
          type: DelegationType.ProcurationHolder,
          provider: DelegationProvider.CompanyRegistry,
        },
      },
    )

    return this.sortDelegation(currentDelegationIndexItems, delegations)
  }

  private async getWardDelegations(user: User) {
    const delegations = await this.delegationsIncomingWardService
      .findAllIncoming(user)
      .then((d) => d.map(toDelegationIndexInfo))

    const currentDelegationIndexItems = await this.delegationIndexModel.findAll(
      {
        where: {
          toNationalId: user.nationalId,
          type: DelegationType.LegalGuardian,
          provider: DelegationProvider.NationalRegistry,
        },
      },
    )

    return this.sortDelegation(currentDelegationIndexItems, delegations)
  }
}
