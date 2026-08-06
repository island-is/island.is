import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { and } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import { User } from '@island.is/auth-nest-tools'
import { SyslumennService } from '@island.is/clients/syslumenn'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import {
  AuthDelegationProvider,
  AuthDelegationType,
  isPersonalRepresentativeDelegationType,
} from '@island.is/shared/types'

import { ClientAllowedScope } from '../clients/models/client-allowed-scope.model'
import { ClientDelegationType } from '../clients/models/client-delegation-type.model'
import { Client } from '../clients/models/client.model'
import { ApiScopeDelegationType } from '../resources/models/api-scope-delegation-type.model'
import { ApiScope } from '../resources/models/api-scope.model'
import { AliveStatusService, NameInfo } from './alive-status.service'
import { UNKNOWN_NAME } from './constants/names'
import { DelegationDTOMapper } from './delegation-dto.mapper'
import { DelegationProviderService } from './delegation-provider.service'
import { DelegationScopeService } from './delegation-scope.service'
import { IncomingDelegationsCompanyService } from './delegations-incoming-company.service'
import { DelegationsIncomingCustomService } from './delegations-incoming-custom.service'
import { DelegationsIncomingRepresentativeService } from './delegations-incoming-representative.service'
import { DelegationsIncomingWardService } from './delegations-incoming-ward.service'
import { DelegationsIndexService } from './delegations-index.service'
import {
  getDelegationNoActorWhereClause,
  validateDistrictCommissionersDelegations,
} from './utils/delegations'
import { DelegationRecordDTO } from './dto/delegation-index.dto'
import { DelegationDTO } from './dto/delegation.dto'
import { MergedDelegationDTO } from './dto/merged-delegation.dto'
import { DelegationScope } from './models/delegation-scope.model'
import { Delegation } from './models/delegation.model'
import { NationalRegistryV3FeatureService } from './national-registry-v3-feature.service'
import { DelegationRecordType } from './types/delegationRecord'

type ClientDelegationInfo = Pick<
  Client,
  'supportedDelegationTypes' | 'requireApiScopes'
>

export type ApiScopeInfo = Pick<
  ApiScope,
  'name' | 'supportedDelegationTypes' | 'isAccessControlled'
>

/**
 * Discriminated result for DELETE /scopes. Controllers translate the
 * variant into an HTTP status and decide whether to audit:
 *  - notFound: delegation didn't exist or wasn't the caller's → 204, skip audit
 *  - updated:  scopes were removed but the delegation still has scopes → 200, audit "deleteScopes"
 *  - destroyed: the last scope was removed and the row was deleted → 204, audit "destroy"
 */
export type DeleteScopesResult =
  | { kind: 'notFound' }
  | { kind: 'updated'; delegation: DelegationDTO }
  | { kind: 'destroyed'; delegationId: string }

interface FindAvailableInput {
  user: User
  delegationTypes?: AuthDelegationType[]
  requestedScopes?: string[]
  otherUser?: string
}

/**
 * Service class for incoming delegations.
 * This class supports domain based delegations.
 */
@Injectable()
export class DelegationsIncomingService {
  constructor(
    @InjectModel(Client)
    private clientModel: typeof Client,
    @InjectModel(ClientAllowedScope)
    private clientAllowedScopeModel: typeof ClientAllowedScope,
    @InjectModel(ApiScope)
    private apiScopeModel: typeof ApiScope,
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
    private incomingDelegationsCompanyService: IncomingDelegationsCompanyService,
    private delegationsIncomingCustomService: DelegationsIncomingCustomService,
    private delegationsIncomingRepresentativeService: DelegationsIncomingRepresentativeService,
    private delegationsIncomingWardService: DelegationsIncomingWardService,
    private delegationsIndexService: DelegationsIndexService,
    private delegationProviderService: DelegationProviderService,
    private delegationScopeService: DelegationScopeService,
    private aliveStatusService: AliveStatusService,
    private sequelize: Sequelize,
    private readonly featureFlagService: FeatureFlagService,
    private readonly syslumennService: SyslumennService,
    private readonly nationalRegistryV3FeatureService: NationalRegistryV3FeatureService,
  ) {}

  async findAllValid(
    user: User,
    domainName?: string,
    otherUser?: string,
  ): Promise<DelegationDTO[]> {
    if (user.actor) {
      throw new BadRequestException(
        'Only supported when the subject is the authenticated user.',
      )
    }

    // Index incoming delegations
    void this.delegationsIndexService.indexDelegations(user)

    const delegationPromises = []

    delegationPromises.push(
      this.delegationsIncomingWardService.findAllIncoming(user),
    )

    delegationPromises.push(
      this.incomingDelegationsCompanyService.findAllIncoming(user),
    )

    delegationPromises.push(
      this.delegationsIncomingCustomService.findAllValidIncoming(
        {
          nationalId: user.nationalId,
          domainName,
        },
        false,
        user,
      ),
    )

    delegationPromises.push(
      this.delegationsIncomingCustomService.findAllValidGeneralMandate(
        {
          nationalId: user.nationalId,
        },
        false,
        user,
      ),
    )

    delegationPromises.push(
      this.delegationsIncomingRepresentativeService.findAllIncoming(
        {
          nationalId: user.nationalId,
        },
        false,
        user,
      ),
    )

    const delegationSets = await Promise.all(delegationPromises)

    return ([] as DelegationDTO[])
      .concat(...delegationSets)
      .filter(
        (delegation) =>
          delegation.fromNationalId !== user.nationalId &&
          (!otherUser || delegation.fromNationalId === otherUser),
      )
  }

  async findAllAvailable({
    user,
    delegationTypes,
    otherUser,
  }: FindAvailableInput): Promise<MergedDelegationDTO[]> {
    const client = await this.getClientDelegationInfo(user)
    if (!client?.supportedDelegationTypes) return []

    const types: AuthDelegationType[] = client.supportedDelegationTypes
      .filter(
        (dt) =>
          !delegationTypes ||
          delegationTypes.includes(dt.delegationType as AuthDelegationType),
      )
      .map((t) => t.delegationType as AuthDelegationType)

    if (types.length == 0) return []

    const providers = await this.delegationProviderService.findProviders(types)

    const clientAllowedApiScopes: ApiScopeInfo[] =
      await this.getClientAllowedApiScopes(user)

    const delegationPromises = []

    if (providers.includes(AuthDelegationProvider.NationalRegistry)) {
      delegationPromises.push(
        this.delegationsIncomingWardService
          .findAllIncoming(
            user,
            clientAllowedApiScopes,
            client.requireApiScopes,
          )
          .then((ds) =>
            ds.map((d) => DelegationDTOMapper.toMergedDelegationDTO(d)),
          ),
      )
    }

    // If procuration holder is enabled, we need to get the general mandate delegations
    if (types?.includes(AuthDelegationType.ProcurationHolder)) {
      delegationPromises.push(
        this.delegationsIncomingCustomService.findCompanyGeneralMandate(
          user,
          clientAllowedApiScopes,
          client.requireApiScopes,
        ),
      )
    }

    if (providers.includes(AuthDelegationProvider.CompanyRegistry)) {
      delegationPromises.push(
        this.incomingDelegationsCompanyService
          .findAllIncoming(
            user,
            clientAllowedApiScopes,
            client.requireApiScopes,
          )
          .then((ds) =>
            ds.map((d) => DelegationDTOMapper.toMergedDelegationDTO(d)),
          ),
      )
    }

    if (types?.includes(AuthDelegationType.Custom)) {
      delegationPromises.push(
        this.delegationsIncomingCustomService.findAllAvailableIncoming(
          user,
          clientAllowedApiScopes,
          client.requireApiScopes,
        ),
      )
    }

    if (types?.includes(AuthDelegationType.GeneralMandate)) {
      delegationPromises.push(
        this.delegationsIncomingCustomService.findAllAvailableGeneralMandate(
          user,
          clientAllowedApiScopes,
          client.requireApiScopes,
        ),
      )
    }

    // PersonalRepresentative: type-based so we support both syslumenn and legacy regardless of delegation_type.provider.
    // - Flag OFF (legacy): use talsmannagrunnur via delegationsIncomingRepresentativeService.
    // - Flag ON: use syslumenn (DistrictCommissionersRegistry index) via the branch below when providers includes DistrictCommissionersRegistry.
    const hasPersonalRepresentativeType = types?.some((t) =>
      isPersonalRepresentativeDelegationType(String(t)),
    )
    const usePersonalRepresentativesFromSyslumenn =
      hasPersonalRepresentativeType
        ? await this.featureFlagService.getValue(
            Features.usePersonalRepresentativesFromSyslumenn,
            false,
            user,
          )
        : true

    if (
      hasPersonalRepresentativeType &&
      !usePersonalRepresentativesFromSyslumenn
    ) {
      delegationPromises.push(
        this.delegationsIncomingRepresentativeService
          .findAllIncoming(
            {
              nationalId: user.nationalId,
              clientAllowedApiScopes,
              requireApiScopes: client.requireApiScopes,
            },
            false,
            user,
          )
          .then((ds) =>
            ds.map((d) => DelegationDTOMapper.toMergedDelegationDTO(d)),
          ),
      )
    }

    if (
      providers.includes(AuthDelegationProvider.DistrictCommissionersRegistry)
    ) {
      const typesForDistrictCommissioners =
        hasPersonalRepresentativeType &&
        !usePersonalRepresentativesFromSyslumenn
          ? types.filter(
              (t) => !isPersonalRepresentativeDelegationType(String(t)),
            )
          : types

      if (typesForDistrictCommissioners.length > 0) {
        delegationPromises.push(
          this.getAvailableDistrictCommissionersRegistryDelegations(
            user,
            typesForDistrictCommissioners,
            clientAllowedApiScopes,
            client.requireApiScopes,
          ),
        )
      }
    }

    const delegationSets = await Promise.all(delegationPromises)

    let delegations = ([] as MergedDelegationDTO[])
      .concat(...delegationSets)
      .filter((delegation) => delegation.fromNationalId !== user.nationalId)

    if (delegationTypes) {
      delegations = delegations.filter((d) =>
        delegationTypes.some((t) => d.types.includes(t)),
      )
    }

    if (otherUser) {
      delegations = delegations.filter((d) => d.fromNationalId === otherUser)
    }

    const mergedDelegationMap = delegations.reduce(
      (
        acc: Map<string, MergedDelegationDTO>,
        delegation: MergedDelegationDTO,
      ) => {
        const existing = acc.get(delegation.fromNationalId)

        if (existing) {
          existing.types.push(...delegation.types)
        } else {
          acc.set(delegation.fromNationalId, delegation)
        }

        return acc
      },
      new Map(),
    )

    // Remove duplicate delegationTypes..
    mergedDelegationMap.forEach((delegation) => {
      delegation.types = Array.from(new Set(delegation.types))
    })

    return [...mergedDelegationMap.values()]
  }

  async deleteScopes(
    user: User,
    delegationId: string,
    scopeNames: string[],
  ): Promise<DeleteScopesResult> {
    if (scopeNames.length === 0) {
      throw new BadRequestException('scopeNames must not be empty.')
    }

    const txResult = await this.sequelize.transaction(async (transaction) => {
      const currentDelegation = await this.delegationModel.findOne({
        where: and(
          { id: delegationId, toNationalId: user.nationalId },
          getDelegationNoActorWhereClause(user),
        ),
        transaction,
        lock: transaction.LOCK.UPDATE,
      })
      if (!currentDelegation) {
        return { kind: 'notFound' as const }
      }

      const existingScopes =
        await this.delegationScopeService.findByDelegationId(
          delegationId,
          transaction,
        )

      const existingScopeNames = new Set(existingScopes.map((s) => s.scopeName))
      const unknownScopes = scopeNames.filter((s) => !existingScopeNames.has(s))
      if (unknownScopes.length > 0) {
        throw new BadRequestException(
          'One or more scopes are not part of this delegation.',
        )
      }

      await this.delegationScopeService.deleteByName(
        delegationId,
        scopeNames,
        transaction,
      )

      const remainingScopes =
        await this.delegationScopeService.findByDelegationId(
          delegationId,
          transaction,
        )

      if (remainingScopes.length === 0) {
        // No scopes remain — destroy the row so it doesn't linger as an
        // empty record that grants nothing.
        await this.delegationModel.destroy({
          where: { id: delegationId },
          transaction,
        })
        return { kind: 'destroyed' as const }
      }

      const refreshed = await this.delegationModel.findOne({
        where: and(
          { id: delegationId, toNationalId: user.nationalId },
          getDelegationNoActorWhereClause(user),
        ),
        include: [
          {
            model: DelegationScope,
            required: false,
            include: [
              {
                attributes: ['displayName'],
                model: ApiScope,
              },
            ],
          },
        ],
        transaction,
      })
      if (!refreshed) {
        return { kind: 'notFound' as const }
      }

      return { kind: 'updated' as const, delegation: refreshed.toDTO() }
    })

    if (txResult.kind === 'notFound') {
      return { kind: 'notFound' }
    }

    // Reindex after commit so we never reindex changes that might roll back.
    void this.delegationsIndexService.indexDelegations(user)

    if (txResult.kind === 'destroyed') {
      return { kind: 'destroyed', delegationId }
    }

    return { kind: 'updated', delegation: txResult.delegation }
  }

  async verifyDelegationAtProvider(
    user: User,
    fromNationalId: string,
    delegationTypes: DelegationRecordType[],
  ): Promise<boolean> {
    const providers = await this.delegationProviderService.findProviders(
      delegationTypes,
    )

    if (
      !providers.includes(AuthDelegationProvider.DistrictCommissionersRegistry)
    ) {
      return true
    }

    const { legalRepIsValid, personalRepIsValid } =
      await validateDistrictCommissionersDelegations({
        user,
        fromNationalId,
        delegationTypes,
        featureFlagService: this.featureFlagService,
        syslumennService: this.syslumennService,
        delegationsIndexService: this.delegationsIndexService,
      })

    return legalRepIsValid || personalRepIsValid
  }

  private async getAvailableDistrictCommissionersRegistryDelegations(
    user: User,
    types: AuthDelegationType[],
    clientAllowedApiScopes: ApiScopeInfo[],
    requireApiScopes?: boolean,
  ): Promise<MergedDelegationDTO[]> {
    const records =
      await this.delegationsIndexService.getAvailableDistrictCommissionersRegistryRecords(
        user,
        types,
        clientAllowedApiScopes,
        requireApiScopes,
      )

    const isNationalRegistryV3DeceasedStatusEnabled =
      await this.nationalRegistryV3FeatureService.getValue(user)

    const { aliveNationalIds, deceasedNationalIds, aliveNameInfo } =
      await this.aliveStatusService.getStatus(
        Array.from(
          new Set(
            records.map((d) => ({
              nationalId: d.fromNationalId,
              name: UNKNOWN_NAME,
            })),
          ),
        ),
        isNationalRegistryV3DeceasedStatusEnabled,
      )

    if (deceasedNationalIds.length > 0) {
      const deceasedDelegations = records.filter((d) =>
        deceasedNationalIds.includes(d.fromNationalId),
      )
      // Delete all deceased delegations from index
      for (const delegation of deceasedDelegations) {
        void this.delegationsIndexService.removeDelegationRecord(
          {
            fromNationalId: delegation.fromNationalId,
            toNationalId: delegation.toNationalId,
            type: delegation.type,
            provider: AuthDelegationProvider.DistrictCommissionersRegistry,
          },
          user,
        )
      }
    }

    const aliveNationalIdSet = new Set(aliveNationalIds)
    const merged = records.reduce(
      (acc: MergedDelegationDTO[], d: DelegationRecordDTO) => {
        if (aliveNationalIdSet.has(d.fromNationalId)) {
          acc.push({
            ...DelegationDTOMapper.recordToMergedDelegationDTO(d),
            fromName: this.getNameFromNameInfo(d.fromNationalId, aliveNameInfo),
          })
        }
        return acc
      },
      [],
    )

    return merged
  }

  private getClientDelegationInfo(
    user: User,
  ): Promise<ClientDelegationInfo | null> {
    return this.clientModel.findOne({
      where: { clientId: user.client, enabled: true },
      include: {
        model: ClientDelegationType,
        required: true,
      },
      attributes: ['requireApiScopes'],
    })
  }

  private async getClientAllowedApiScopes(user: User): Promise<ApiScopeInfo[]> {
    if (!user) return []

    const clientAllowedScopes = (
      await this.clientAllowedScopeModel.findAll({
        where: {
          clientId: user.client,
        },
      })
    ).map((s) => s.scopeName)

    return await this.apiScopeModel.findAll({
      where: {
        name: clientAllowedScopes,
        enabled: true,
      },
      include: {
        model: ApiScopeDelegationType,
        required: true,
      },
      attributes: ['name', 'isAccessControlled'],
    })
  }

  private getNameFromNameInfo(
    nationalId: string,
    nameInfo: NameInfo[],
  ): string {
    return (
      nameInfo.find((n) => n.nationalId === nationalId)?.name ?? UNKNOWN_NAME
    )
  }
}
