import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { User } from '@island.is/auth-nest-tools'
import { SyslumennService } from '@island.is/clients/syslumenn'
import { logger } from '@island.is/logging'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import {
  AuthDelegationProvider,
  AuthDelegationType,
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
import { IncomingDelegationsCompanyService } from './delegations-incoming-company.service'
import { DelegationsIncomingCustomService } from './delegations-incoming-custom.service'
import { DelegationsIncomingRepresentativeService } from './delegations-incoming-representative.service'
import { DelegationsIncomingWardService } from './delegations-incoming-ward.service'
import { DelegationsIndexService } from './delegations-index.service'
import { DelegationRecordDTO } from './dto/delegation-index.dto'
import { DelegationDTO } from './dto/delegation.dto'
import { MergedDelegationDTO } from './dto/merged-delegation.dto'
import { NationalRegistryV3FeatureService } from './national-registry-v3-feature.service'

type ClientDelegationInfo = Pick<
  Client,
  'supportedDelegationTypes' | 'requireApiScopes'
>

export type ApiScopeInfo = Pick<
  ApiScope,
  'name' | 'supportedDelegationTypes' | 'isAccessControlled'
>

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
    private incomingDelegationsCompanyService: IncomingDelegationsCompanyService,
    private delegationsIncomingCustomService: DelegationsIncomingCustomService,
    private delegationsIncomingRepresentativeService: DelegationsIncomingRepresentativeService,
    private delegationsIncomingWardService: DelegationsIncomingWardService,
    private delegationsIndexService: DelegationsIndexService,
    private delegationProviderService: DelegationProviderService,
    private aliveStatusService: AliveStatusService,
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

    if (
      providers.includes(AuthDelegationProvider.PersonalRepresentativeRegistry)
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
      delegationPromises.push(
        this.getAvailableDistrictCommissionersRegistryDelegations(
          user,
          types,
          clientAllowedApiScopes,
          client.requireApiScopes,
        ),
      )
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

  async verifyDelegationAtProvider(
    user: User,
    fromNationalId: string,
    delegationTypes: AuthDelegationType[],
  ): Promise<boolean> {
    const providers = await this.delegationProviderService.findProviders(
      delegationTypes,
    )

    if (
      providers.includes(AuthDelegationProvider.DistrictCommissionersRegistry)
    ) {
      try {
        const delegationFound =
          await this.syslumennService.checkIfDelegationExists(
            user.nationalId,
            fromNationalId,
          )

        if (delegationFound) {
          return true
        } else {
          void this.delegationsIndexService.removeDelegationRecord(
            {
              fromNationalId,
              toNationalId: user.nationalId,
              type: AuthDelegationType.LegalRepresentative,
              provider: AuthDelegationProvider.DistrictCommissionersRegistry,
            },
            user,
          )
        }
      } catch (error) {
        logger.error(
          `Failed checking if delegation exists at provider '${AuthDelegationProvider.DistrictCommissionersRegistry}'`,
        )
      }
    }

    return false
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
      const deletePromises = deceasedDelegations.map((delegation) => {
        this.delegationsIndexService.removeDelegationRecord(
          {
            fromNationalId: delegation.fromNationalId,
            toNationalId: delegation.toNationalId,
            type: delegation.type,
            provider: AuthDelegationProvider.DistrictCommissionersRegistry,
          },
          user,
        )
      })

      const results = await Promise.allSettled(deletePromises)
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          logger.error('Failed to remove delegation record', {
            error: result.reason,
            delegation: deceasedDelegations[index],
          })
        }
      })
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
