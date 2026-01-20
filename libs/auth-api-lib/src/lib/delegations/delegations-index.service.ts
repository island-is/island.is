import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import union from 'lodash/union'
import { Op } from 'sequelize'
import * as kennitala from 'kennitala'

import { Auth, User } from '@island.is/auth-nest-tools'
import { AuditService } from '@island.is/nest/audit'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  AuthDelegationProvider,
  AuthDelegationType,
  getPersonalRepresentativeDelegationType,
} from '@island.is/shared/types'

import { PersonalRepresentativeScopePermissionService } from '../personal-representative/services/personal-representative-scope-permission.service'
import { ApiScope } from '../resources/models/api-scope.model'
import { UserIdentitiesService } from '../user-identities/user-identities.service'
import { IncomingDelegationsCompanyService } from './delegations-incoming-company.service'
import { DelegationsIncomingCustomService } from './delegations-incoming-custom.service'
import { DelegationsIncomingRepresentativeService } from './delegations-incoming-representative.service'
import { DelegationsIncomingWardService } from './delegations-incoming-ward.service'
import { ApiScopeInfo } from './delegations-incoming.service'
import {
  DelegationRecordDTO,
  DelegationRecordInputDTO,
  PaginatedDelegationRecordDTO,
} from './dto/delegation-index.dto'
import { DelegationDTO } from './dto/delegation.dto'
import { DelegationIndexMeta } from './models/delegation-index-meta.model'
import { DelegationIndex } from './models/delegation-index.model'
import { DelegationDirection } from './types/delegationDirection'
import {
  DelegationRecordType,
  PersonalRepresentativeDelegationType,
} from './types/delegationRecord'
import {
  validateDelegationTypeAndProvider,
  validateToAndFromNationalId,
} from './utils/delegations'
import { getXBirthday } from './utils/getXBirthday'
import { isUnderXAge } from './utils/isUnderXAge'
import { ApiScopeDelegationType } from '../resources/models/api-scope-delegation-type.model'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'

const TEN_MINUTES = 1000 * 60 * 10
const ONE_WEEK = 1000 * 60 * 60 * 24 * 7

// When delegation providers have been refactored to use the webhook method
// with hard check on action we need to exclude them from the standard indexing.
// We register our current providers as indexed, as all new providers are expected
// to use the webhook method.
const INDEXED_DELEGATION_PROVIDERS = [
  AuthDelegationProvider.Custom,
  AuthDelegationProvider.PersonalRepresentativeRegistry,
  AuthDelegationProvider.CompanyRegistry,
  AuthDelegationProvider.NationalRegistry,
]

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
    @InjectModel(ApiScopeDelegationType)
    private apiScopeDelegationTypeModel: typeof ApiScopeDelegationType,
    @InjectModel(DelegationIndex)
    private delegationIndexModel: typeof DelegationIndex,
    @InjectModel(DelegationIndexMeta)
    private delegationIndexMetaModel: typeof DelegationIndexMeta,
    private delegationsIncomingCustomService: DelegationsIncomingCustomService,
    private delegationsIncomingRepresentativeService: DelegationsIncomingRepresentativeService,
    private delegationsIncomingCompanyService: IncomingDelegationsCompanyService,
    private delegationsIncomingWardService: DelegationsIncomingWardService,
    private personalRepresentativeScopePermissionService: PersonalRepresentativeScopePermissionService,
    private userIdentitiesService: UserIdentitiesService,
    private featureFlagService: FeatureFlagService,

    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private auditService: AuditService,
  ) {}

  private async filterByFeatureFlaggedDelegationTypes(
    delegations: DelegationRecordDTO[],
  ): Promise<DelegationRecordDTO[]> {
    console.log('in filterByFeatureFlaggedDelegationTypes', delegations)
    // Get unique fromNationalIds from delegations
    const uniqueFromNationalIds = [
      ...new Set(delegations.map((d) => d.fromNationalId)),
    ]

    // Get feature flag values for each unique fromNationalId
    const featureFlagValues = await Promise.all(
      uniqueFromNationalIds.map(async (fromNationalId) => {
        const types = await this.featureFlagService.getValue(
          Features.delegationTypesWithNotificationsEnabled,
          '',
          { nationalId: fromNationalId } as User,
        )

        return {
          fromNationalId,
          featureFlaggedDelegationTypes: this.parseFeatureFlagValue(types),
        }
      }),
    )

    // Create a map for quick lookup
    const featureFlagMap = new Map(
      featureFlagValues.map(
        ({ fromNationalId, featureFlaggedDelegationTypes }) => [
          fromNationalId,
          featureFlaggedDelegationTypes,
        ],
      ),
    )

    console.log('here?', delegations.length)

    // Filter delegations based on their fromNationalId's feature flag value
    return delegations.filter((delegation) => {
      console.log('here2')
      const featureFlaggedDelegationTypes = featureFlagMap.get(
        delegation.fromNationalId,
      )

      // Case: No allowed delegation types
      if (!featureFlaggedDelegationTypes) {
        return false
      }

      // Case: All delegation types are allowed
      if (featureFlaggedDelegationTypes === '*') {
        return true
      }

      // Special case: Custom and GeneralMandate delegation types are stored with a ":person" or ":company" suffix,
      // indicating if the value is allowing for delegations of the type from a person or a company.
      if (
        delegation.type === AuthDelegationType.Custom ||
        delegation.type === AuthDelegationType.GeneralMandate
      ) {
        const isFromPerson =
          featureFlaggedDelegationTypes.has(`${delegation.type}:person`) &&
          kennitala.isPerson(delegation.fromNationalId)

        const isFromCompany =
          featureFlaggedDelegationTypes.has(`${delegation.type}:company`) &&
          kennitala.isCompany(delegation.fromNationalId)

        return isFromPerson || isFromCompany
      }

      console.log('return', featureFlaggedDelegationTypes)

      return featureFlaggedDelegationTypes.has(delegation.type)
    })
  }

  private parseFeatureFlagValue(types: string): Set<string> | '*' | undefined {
    if (!types?.trim()) return undefined // Empty value means no delegation types allowed
    if (types?.trim() === '*') return '*' // All delegation types allowed
    return new Set(types?.split(',').map((type) => type.trim()))
  }

  /* Lookup delegations in index for user for specific scope(s) */
  async getDelegationRecords({
    scopes,
    nationalId,
    direction = DelegationDirection.OUTGOING,
  }: {
    scopes: string[]
    nationalId: string
    direction: DelegationDirection
  }): Promise<PaginatedDelegationRecordDTO> {
    // Validate that all scopes exist and fetch their delegation types
    const apiScopes = await this.apiScopeModel.findAll({
      where: {
        name: { [Op.in]: scopes },
      },
      include: {
        model: ApiScopeDelegationType,
        as: 'supportedDelegationTypes',
        required: false,
      },
    })

    if (apiScopes.length !== scopes.length) {
      const foundScopes = new Set(apiScopes.map((s) => s.name))
      const invalidScopes = scopes.filter((s) => !foundScopes.has(s))
      throw new BadRequestException(
        `Invalid scope(s): ${invalidScopes.join(', ')}`,
      )
    }

    if (!kennitala.isValid(nationalId)) {
      throw new BadRequestException('Invalid national id')
    }

    const where = {
      ...(direction === DelegationDirection.INCOMING
        ? { toNationalId: nationalId }
        : { fromNationalId: nationalId }),
      validTo: { [Op.or]: [{ [Op.gte]: new Date() }, { [Op.is]: null }] },
    }

    const allDelegationTypes = new Set<AuthDelegationType>()
    const customDelegationScopes = new Set<string>()

    for (const scope of apiScopes) {
      const scopeDelegationTypes = scope.supportedDelegationTypes
        ? scope.supportedDelegationTypes.map(
            (d: ApiScopeDelegationType) =>
              d.delegationType as AuthDelegationType,
          )
        : []

      scopeDelegationTypes.forEach((type: AuthDelegationType) => {
        if (type === AuthDelegationType.Custom) {
          customDelegationScopes.add(scope.name)
        } else {
          allDelegationTypes.add(type)
        }
      })
    }

    // Build a single query with all OR conditions
    const orConditions = [] as Array<Record<string, unknown>>

    // Add condition for non-custom delegation types
    if (allDelegationTypes.size > 0) {
      orConditions.push({
        type: { [Op.in]: Array.from(allDelegationTypes) },
      })
    }

    // Add conditions for custom delegations (one per scope that supports it)
    if (customDelegationScopes.size > 0) {
      for (const scopeName of customDelegationScopes) {
        orConditions.push({
          type: { [Op.in]: [AuthDelegationType.Custom] },
          customDelegationScopes: { [Op.contains]: [scopeName] },
        })
      }
    }

    // Execute a single delegation index query
    const allDelegations =
      orConditions.length > 0
        ? await this.delegationIndexModel
            .findAll({
              where: {
                ...where,
                [Op.or]: orConditions,
              },
            })
            .then((d) => d.map((d) => d.toDTO()))
            .then((d) => this.filterByFeatureFlaggedDelegationTypes(d))
        : []

    // Deduplicate delegations that may match multiple scopes
    // A delegation is unique by (fromNationalId, toNationalId, type)
    const uniqueDelegations = allDelegations.filter(
      (delegation, index, self) =>
        index ===
        self.findIndex(
          (d) =>
            d.fromNationalId === delegation.fromNationalId &&
            d.toNationalId === delegation.toNationalId &&
            d.type === delegation.type,
        ),
    )

    // For now, we don't implement pagination but still return the paginated response
    return {
      data: uniqueDelegations,
      totalCount: uniqueDelegations.length,
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

    await this.saveToIndex(
      user.nationalId,
      delegations,
      user,
      Object.values(AuthDelegationType),
    )

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
  async indexCustomDelegations(nationalId: string, auth: Auth) {
    const delegations = await this.getCustomDelegations(nationalId, true)
    await this.saveToIndex(nationalId, delegations, auth, [
      AuthDelegationType.Custom,
    ])
  }

  /* Index incoming general mandate delegations */
  async indexGeneralMandateDelegations(nationalId: string, auth?: Auth) {
    const delegations = await this.getGeneralMandateDelegation(nationalId, true)
    await this.saveToIndex(nationalId, delegations, auth, [
      AuthDelegationType.GeneralMandate,
    ])
  }

  /* Index incoming personal representative delegations */
  async indexRepresentativeDelegations(nationalId: string, auth: Auth) {
    const delegations = await this.getRepresentativeDelegations(
      nationalId,
      true,
    )
    await this.saveToIndex(nationalId, delegations, auth, [
      AuthDelegationType.PersonalRepresentative,
    ])
  }

  /* Add item to index */
  async createOrUpdateDelegationRecord(
    delegation: DelegationRecordInputDTO,
    auth: Auth,
  ) {
    validateCrudParams(delegation)

    // legal guardian delegations have a validTo date
    if (delegation.type === AuthDelegationType.LegalGuardian) {
      // ensure delegation only exists if child is under 18
      if (!delegation.validTo) {
        delegation.validTo = getXBirthday(18, delegation.fromNationalId)
      }

      // create additional delegation for children under 16
      const isMinor = isUnderXAge(16, delegation.fromNationalId)
      if (isMinor) {
        await this.delegationIndexModel.upsert({
          ...delegation,
          type: AuthDelegationType.LegalGuardianMinor,
          validTo: getXBirthday(16, delegation.fromNationalId),
        })
      }
    }

    const [updatedDelegation] = await this.auditService.auditPromise(
      {
        auth,
        action: 'create-or-update-delegation-record',
        namespace: '@island.is/auth/delegation-index',
        resources: delegation.toNationalId,
        alsoLog: true,
        meta: {
          delegation,
        },
      },
      this.delegationIndexModel.upsert(delegation),
    )

    return updatedDelegation.toDTO()
  }

  /* Delete record from index */
  async removeDelegationRecord(
    delegation: DelegationRecordInputDTO,
    auth: Auth,
  ) {
    validateCrudParams(delegation)

    await this.auditService.auditPromise(
      {
        auth,
        action: 'remove-delegation-record',
        namespace: '@island.is/auth/delegation-index',
        resources: delegation.toNationalId,
        alsoLog: true,
        meta: {
          delegation,
        },
      },
      this.delegationIndexModel.destroy({
        where: {
          fromNationalId: delegation.fromNationalId,
          toNationalId: delegation.toNationalId,
          provider: delegation.provider,
          type: delegation.type,
        },
      }),
    )
  }

  async getAvailableDistrictCommissionersRegistryRecords(
    user: User,
    types: AuthDelegationType[],
    clientAllowedApiScopes: ApiScopeInfo[],
    requireApiScopes?: boolean,
  ): Promise<DelegationRecordDTO[]> {
    if (requireApiScopes) {
      const noSupportedScope = !clientAllowedApiScopes.some(
        (s) =>
          s.supportedDelegationTypes?.some(
            (dt) => dt.delegationType == AuthDelegationType.LegalRepresentative,
          ) && !s.isAccessControlled,
      )
      if (noSupportedScope) {
        return []
      }
    }

    return this.delegationIndexModel
      .findAll({
        where: {
          toNationalId: user.nationalId,
          provider: AuthDelegationProvider.DistrictCommissionersRegistry,
          type: types,
          validTo: { [Op.or]: [{ [Op.gte]: new Date() }, { [Op.is]: null }] },
        },
      })
      .then((d) => d.map((d) => d.toDTO()))
  }

  /*
   * Private methods
   * */
  private async saveToIndex(
    nationalId: string,
    delegations: DelegationIndexInfo[],
    // Some entrypoints to indexing do not have a user auth object or have a 3rd party user
    // so we take the auth separately from the subject nationalId
    auth?: Auth,
    typesToForceIndex?: AuthDelegationType[],
  ) {
    const types = Array.from(
      new Set([
        ...delegations.map((d) => d.type),
        ...(typesToForceIndex ?? []),
      ]),
    )

    const currRecords = await this.delegationIndexModel.findAll({
      where: {
        toNationalId: nationalId,
        provider: INDEXED_DELEGATION_PROVIDERS,
        type: types,
      },
    })

    // add subject id to new delegations
    const delegationsWithSubjectIds = await this.getSubjectIds({
      newRecords: delegations,
      currRecords,
    })

    const { created, updated, deleted } = this.sortDelegation({
      newRecords: delegationsWithSubjectIds,
      currRecords,
    })

    const ops = [
      ...(created.length
        ? [this.delegationIndexModel.bulkCreate(created)]
        : []),
      ...updated.map((d) =>
        this.delegationIndexModel.update(d, {
          where: {
            fromNationalId: d.fromNationalId,
            toNationalId: d.toNationalId,
            provider: d.provider,
            type: d.type,
          },
        }),
      ),
      ...deleted.map((d) =>
        this.delegationIndexModel.destroy({
          where: {
            fromNationalId: d.fromNationalId,
            toNationalId: d.toNationalId,
            provider: d.provider,
            type: d.type,
          },
        }),
      ),
    ]

    const indexingResults = await Promise.allSettled(ops)

    // log any errors
    indexingResults.forEach((p) => {
      if (p.status === 'rejected') {
        console.error(p.reason)
      }
    })

    // saveToIndex is used by multiple entry points, when indexing so this
    // is the common place to audit updates in the index.
    this.auditService.audit({
      ...(auth ? { auth } : { system: true }),
      action: 'save-to-index',
      namespace: '@island.is/auth/delegation-index',
      alsoLog: true,
      resources: nationalId,
      meta: {
        created,
        updated,
        deleted,
      },
    })
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
            d.toNationalId === curr.toNationalId &&
            d.fromNationalId === curr.fromNationalId &&
            d.type === curr.type &&
            d.provider === curr.provider,
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

  private async getSubjectIds({
    currRecords,
    newRecords,
  }: {
    newRecords: DelegationIndexInfo[]
    currRecords: DelegationIndexInfo[]
  }): Promise<DelegationIndexInfo[]> {
    return Promise.all(
      newRecords.map(async (d) => {
        if (d.subjectId) {
          return d
        }

        // subjectId is unique between from and to nationalId so if we already have a delegation with the same from and to nationalId, we can use that subjectId
        let subjectId =
          currRecords.find(
            (delegation) =>
              delegation.fromNationalId === d.fromNationalId &&
              delegation.subjectId,
          )?.subjectId ?? null

        // don't fail indexing if we can't find or create a subjectId
        try {
          if (!subjectId) {
            subjectId = await this.userIdentitiesService.findOrCreateSubjectId({
              toNationalId: d.toNationalId,
              fromNationalId: d.fromNationalId,
            })
          }
        } catch {
          return d
        }

        return { ...d, subjectId }
      }),
    )
  }

  private async getGeneralMandateDelegation(
    nationalId: string,
    useMaster = false,
  ) {
    const delegation =
      await this.delegationsIncomingCustomService.findAllValidGeneralMandate(
        { nationalId },
        useMaster,
      )

    return delegation.map(toDelegationIndexInfo)
  }

  private async getCustomDelegations(nationalId: string, useMaster = false) {
    const delegations =
      await this.delegationsIncomingCustomService.findAllValidIncoming(
        { nationalId },
        useMaster,
      )

    // Merge delegations by `fromNationalId`, combining scopes if necessary
    const delegationMap = new Map()

    delegations.forEach((delegation) => {
      const existing = delegationMap.get(delegation.fromNationalId)

      if (existing) {
        existing.scopes = union(existing.scopes, delegation.scopes)
      } else {
        delegationMap.set(delegation.fromNationalId, delegation)
      }
    })

    // Convert the map back to an array
    const mergedDelegations = Array.from(delegationMap.values())

    return mergedDelegations.map(toDelegationIndexInfo)
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
              type: getPersonalRepresentativeDelegationType(
                right.code,
              ) as PersonalRepresentativeDelegationType,
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
              validTo:
                delegation.type === AuthDelegationType.LegalGuardian
                  ? getXBirthday(18, delegation.fromNationalId) // validTo is the date the child turns 18 for legal guardian delegations
                  : getXBirthday(16, delegation.fromNationalId), // validTo is the date the child turns 16 for legal guardian minor delegations
            }),
          )
          .filter((d) => d.validTo !== null), // if child has already turned 18/16, we don't want to index the delegation
    )
  }
}
