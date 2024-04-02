import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import * as kennitala from 'kennitala'
import startOfDay from 'date-fns/startOfDay'

import { User } from '@island.is/auth-nest-tools'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'

import { ApiScope } from '../resources/models/api-scope.model'
import { PersonalRepresentativeScopePermissionService } from '../personal-representative/services/personal-representative-scope-permission.service'
import { DelegationIndex } from './models/delegation-index.model'
import { DelegationIndexMeta } from './models/delegation-index-meta.model'
import { DelegationDTO } from './dto/delegation.dto'
import {
  DelegationRecordInputDTO,
  DelegationRecordDTO,
  PaginatedDelegationRecordDTO,
} from './dto/delegation-index.dto'
import { DelegationsIncomingCustomService } from './delegations-incoming-custom.service'
import { DelegationsIncomingRepresentativeService } from './delegations-incoming-representative.service'
import { IncomingDelegationsCompanyService } from './delegations-incoming-company.service'
import { DelegationsIncomingWardService } from './delegations-incoming-ward.service'
import {
  DelegationRecordType,
  PersonalRepresentativeDelegationType,
} from './types/delegationRecord'
import {
  validateDelegationTypeAndProvider,
  validateToAndFromNationalId,
  delegationProviderTypeMap,
} from './utils/delegations'

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
  | 'subjectId'
>

type DelegationDTOWithStringType = Omit<DelegationDTO, 'type'> & {
  type: DelegationRecordType
}

type SortedDelegations = {
  created: DelegationIndexInfo[]
  updated: DelegationIndexInfo[]
  deleted: DelegationIndexInfo[]
}

type FetchDelegationRecordsArgs = {
  scope: ApiScope
  fromNationalId: string
}

const getTimeUntilEighteen = (nationalId: string) => {
  const birthDate = kennitala.info(nationalId).birthday
  const now = startOfDay(new Date())
  const eighteen = startOfDay(
    new Date(
      birthDate.getFullYear() + 18,
      birthDate.getMonth(),
      birthDate.getDate(),
    ),
  )

  const timeUntilEighteen = eighteen.getTime() - now.getTime()

  return timeUntilEighteen > 0 ? new Date(timeUntilEighteen) : null
}

const validateCrudParams = (delegation: DelegationRecordInputDTO) => {
  if (!validateDelegationTypeAndProvider(delegation)) {
    throw new BadRequestException(
      'Invalid delegation type and provider combination',
    )
  }

  if (!validateToAndFromNationalId(delegation)) {
    throw new BadRequestException('Invalid national ids')
  }

  if (
    delegation.validTo &&
    new Date(delegation.validTo).getTime() <= new Date().getTime()
  ) {
    throw new BadRequestException('Invalid validTo')
  }
}

const getPersonalRepresentativeDelegationType = (right: string) =>
  `${AuthDelegationType.PersonalRepresentative}:${right}` as PersonalRepresentativeDelegationType

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
  delegation: DelegationDTOWithStringType,
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
 * Delegation index stores delegations for a user to bypass the need to fetch them from third party services
 * */
@Injectable()
export class DelegationsIndexService {
  constructor(
    @InjectModel(ApiScope)
    private apiScopeModel: typeof ApiScope,
    @InjectModel(DelegationIndex)
    private delegationIndexModel: typeof DelegationIndex,
    @InjectModel(DelegationIndexMeta)
    private delegationIndexMetaModel: typeof DelegationIndexMeta,
    private delegationsIncomingCustomService: DelegationsIncomingCustomService,
    private delegationsIncomingRepresentativeService: DelegationsIncomingRepresentativeService,
    private delegationsIncomingCompanyService: IncomingDelegationsCompanyService,
    private delegationsIncomingWardService: DelegationsIncomingWardService,
    private personalRepresentativeScopePermissionService: PersonalRepresentativeScopePermissionService,
  ) {}

  /* Lookup delegations in index from user for specific scope */
  async getDelegationRecords({
    scope,
    fromNationalId,
  }: {
    scope: string
    fromNationalId: string
  }): Promise<PaginatedDelegationRecordDTO> {
    const apiScope = await this.apiScopeModel.findOne({
      where: {
        name: scope,
      },
    })

    if (!apiScope) {
      throw new BadRequestException('Invalid scope')
    }

    if (!kennitala.isValid(fromNationalId)) {
      throw new BadRequestException('Invalid national id')
    }

    const delegations = await Promise.all([
      this.getCustomDelegationRecords({ scope: apiScope, fromNationalId }),
      this.getRepresentativeDelegationRecords({
        scope: apiScope,
        fromNationalId,
      }),
      this.getCompanyDelegationRecords({ scope: apiScope, fromNationalId }),
      this.getWardDelegationRecords({ scope: apiScope, fromNationalId }),
    ]).then((d) => d.flat())

    // For now, we don't implement pagination but still return the paginated response
    return {
      data: delegations,
      totalCount: delegations.length,
      pageInfo: {
        hasNextPage: false,
      },
    }
  }

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
    ]).then((d) => d.flat())

    await this.saveToIndex(user.nationalId, delegations)

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
    const delegations = await this.getCustomDelegations(nationalId, true)
    await this.saveToIndex(nationalId, delegations)
  }

  /* Index incoming personal representative delegations */
  async indexRepresentativeDelegations(nationalId: string) {
    const delegations = await this.getRepresentativeDelegations(
      nationalId,
      true,
    )
    await this.saveToIndex(nationalId, delegations)
  }

  /* Add item to index */
  async createOrUpdateDelegationRecord(delegation: DelegationRecordInputDTO) {
    validateCrudParams(delegation)

    const [updatedDelegation] = await this.delegationIndexModel.upsert(
      delegation,
    )

    return updatedDelegation.toDTO()
  }

  /* Delete record from index */
  async removeDelegationRecord(delegation: DelegationRecordInputDTO) {
    validateCrudParams(delegation)

    await this.delegationIndexModel.destroy({
      where: {
        fromNationalId: delegation.fromNationalId,
        toNationalId: delegation.toNationalId,
        provider: delegation.provider,
        type: delegation.type,
      },
    })
  }

  /*
   * Private methods
   * */
  private async saveToIndex(
    nationalId: string,
    delegations: DelegationIndexInfo[],
  ) {
    const currRecords = await this.delegationIndexModel.findAll({
      where: {
        toNationalId: nationalId,
      },
    })

    // add subject id to new delegations
    const delegationsWithSubjectIds = this.getSubjectIds({
      newRecords: delegations,
      currRecords,
    })

    const { created, updated, deleted } = this.sortDelegation({
      newRecords: delegationsWithSubjectIds,
      currRecords,
    })

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

  private sortDelegation({
    currRecords,
    newRecords,
  }: {
    newRecords: DelegationIndexInfo[]
    currRecords: DelegationIndexInfo[]
  }): SortedDelegations {
    const { created, updated } = newRecords.reduce(
      (acc, curr) => {
        const existing = currRecords.find(
          (d) =>
            d.fromNationalId === curr.fromNationalId &&
            d.type === curr.type &&
            d.provider === curr.provider,
        )

        if (
          existing &&
          (existing.validTo !== curr.validTo ||
            !hasAllSameScopes(
              existing.customDelegationScopes,
              curr.customDelegationScopes,
            ))
        ) {
          acc.updated.push(curr)
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

    const deleted = currRecords.filter(
      (delegation) =>
        !newRecords.some(
          (d) =>
            d.fromNationalId === delegation.fromNationalId &&
            d.type === delegation.type &&
            d.provider === delegation.provider,
        ),
    )

    return { deleted, created, updated }
  }

  private getSubjectIds({
    currRecords,
    newRecords,
  }: {
    newRecords: DelegationIndexInfo[]
    currRecords: DelegationIndexInfo[]
  }) {
    return newRecords.map((d) => {
      if (d.subjectId) {
        return d
      }

      // subject id is unique between from and to nationalId so if we already have a delegation with the same from and to nationalId, we can use that subjectId
      const subjectId = currRecords.find(
        (delegation) =>
          delegation.fromNationalId === d.fromNationalId &&
          delegation.subjectId,
      )?.subjectId

      if (!subjectId) {
        // call new function to get subjectId
      }

      return { ...d, subjectId }
    })
  }

  private async getCustomDelegations(nationalId: string, useMaster = false) {
    return this.delegationsIncomingCustomService
      .findAllValidIncoming({ nationalId }, useMaster)
      .then((d) => d.map(toDelegationIndexInfo))
  }

  private async getRepresentativeDelegations(
    nationalId: string,
    useMaster = false,
  ) {
    return this.delegationsIncomingRepresentativeService
      .findAllIncoming({ nationalId }, useMaster)
      .then((d) => {
        // append the personal representative right type code to the delegation type in index
        const delegationsWithRights = d.reduce(
          (acc: DelegationDTOWithStringType[], delegation) => {
            if (!delegation.rights) {
              return acc
            }

            const delegations = delegation.rights.map((right) => ({
              ...delegation,
              type: getPersonalRepresentativeDelegationType(right.code),
            }))

            return [...acc, ...delegations]
          },
          [],
        )

        return delegationsWithRights.map(toDelegationIndexInfo)
      })
  }

  private async getCompanyDelegations(user: User) {
    return await this.delegationsIncomingCompanyService
      .findAllIncoming(user)
      .then((d) => d.map(toDelegationIndexInfo))
  }

  private async getWardDelegations(user: User) {
    return this.delegationsIncomingWardService.findAllIncoming(user).then(
      (delegations) =>
        delegations
          .map((delegation) =>
            toDelegationIndexInfo({
              ...delegation,
              validTo: getTimeUntilEighteen(delegation.fromNationalId), // validTo is the date the child turns 18
            }),
          )
          .filter((d) => d.validTo !== null), // if child has already turned 18, we don't want to index the delegation
    )
  }

  private async getCustomDelegationRecords({
    scope,
    fromNationalId,
  }: FetchDelegationRecordsArgs): Promise<DelegationRecordDTO[]> {
    if (!scope.allowExplicitDelegationGrant) {
      return []
    }

    return this.delegationIndexModel
      .findAll({
        where: {
          fromNationalId,
          type: AuthDelegationType.Custom,
          provider: AuthDelegationProvider.Custom,
          customDelegationScopes: { [Op.contains]: [scope.name] },
          validTo: { [Op.or]: [{ [Op.gte]: new Date() }, { [Op.is]: null }] },
        },
      })
      .then((d) => d.map((d) => d.toDTO()))
  }

  private async getRepresentativeDelegationRecords({
    scope,
    fromNationalId,
  }: FetchDelegationRecordsArgs): Promise<DelegationRecordDTO[]> {
    if (!scope.grantToPersonalRepresentatives) {
      return []
    }

    // Get all personal representative right types that are permitted for the scope and construct the delegation types
    const permittedDelegationTypes =
      await this.personalRepresentativeScopePermissionService
        .getScopePermissionsAsync(scope.name)
        .then((scopePermission) =>
          scopePermission.map((rightType) =>
            getPersonalRepresentativeDelegationType(rightType.rightTypeCode),
          ),
        )

    return this.delegationIndexModel
      .findAll({
        where: {
          fromNationalId,
          type: {
            [Op.in]: permittedDelegationTypes,
          },
          provider: AuthDelegationProvider.PersonalRepresentativeRegistry,
          validTo: { [Op.or]: [{ [Op.gte]: new Date() }, { [Op.is]: null }] },
        },
      })
      .then((d) => d.map((d) => d.toDTO()))
  }

  private async getCompanyDelegationRecords({
    scope,
    fromNationalId,
  }: FetchDelegationRecordsArgs): Promise<DelegationRecordDTO[]> {
    if (!scope.grantToProcuringHolders) {
      return []
    }

    return this.delegationIndexModel
      .findAll({
        where: {
          fromNationalId,
          type: {
            [Op.in]:
              delegationProviderTypeMap[AuthDelegationProvider.CompanyRegistry],
          },
          provider: AuthDelegationProvider.CompanyRegistry,
          validTo: { [Op.or]: [{ [Op.gte]: new Date() }, { [Op.is]: null }] },
        },
      })
      .then((d) => d.map((d) => d.toDTO()))
  }

  private async getWardDelegationRecords({
    scope,
    fromNationalId,
  }: FetchDelegationRecordsArgs): Promise<DelegationRecordDTO[]> {
    if (!scope.grantToLegalGuardians) {
      return []
    }

    return this.delegationIndexModel
      .findAll({
        where: {
          fromNationalId,
          type: {
            [Op.in]:
              delegationProviderTypeMap[
                AuthDelegationProvider.NationalRegistry
              ],
          },
          provider: AuthDelegationProvider.NationalRegistry,
          validTo: { [Op.or]: [{ [Op.gte]: new Date() }, { [Op.is]: null }] },
        },
      })
      .then((d) => d.map((d) => d.toDTO()))
  }
}
