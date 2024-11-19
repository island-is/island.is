import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { InjectModel } from '@nestjs/sequelize'
import startOfDay from 'date-fns/startOfDay'
import * as kennitala from 'kennitala'
import uniqBy from 'lodash/uniqBy'
import { Op } from 'sequelize'

import { User } from '@island.is/auth-nest-tools'
import { AuditService } from '@island.is/nest/audit'
import { AuthDelegationType } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'

import { ApiScopeDelegationType } from '../resources/models/api-scope-delegation-type.model'
import { ApiScopeUserAccess } from '../resources/models/api-scope-user-access.model'
import { ApiScope } from '../resources/models/api-scope.model'
import { AliveStatusService, NameInfo } from './alive-status.service'
import { UNKNOWN_NAME } from './constants/names'
import { DelegationConfig } from './DelegationConfig'
import { ApiScopeInfo } from './delegations-incoming.service'
import { DelegationDTO } from './dto/delegation.dto'
import { MergedDelegationDTO } from './dto/merged-delegation.dto'
import { DelegationDelegationType } from './models/delegation-delegation-type.model'
import { DelegationScope } from './models/delegation-scope.model'
import { Delegation } from './models/delegation.model'
import { NationalRegistryV3FeatureService } from './national-registry-v3-feature.service'
import { DelegationValidity } from './types/delegationValidity'
import { getScopeValidityWhereClause } from './utils/scopes'

type FindAllValidIncomingOptions = {
  nationalId: string
  domainName?: string
  validity?: DelegationValidity
}

/**
 * Service class for incoming delegations.
 * This class supports domain based delegations.
 */
@Injectable()
export class DelegationsIncomingCustomService {
  constructor(
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
    @InjectModel(ApiScopeUserAccess)
    private apiScopeUserAccessModel: typeof ApiScopeUserAccess,
    private aliveStatusService: AliveStatusService,
    @Inject(DelegationConfig.KEY)
    private delegationConfig: ConfigType<typeof DelegationConfig>,
    private auditService: AuditService,
    private readonly nationalRegistryV3FeatureService: NationalRegistryV3FeatureService,
  ) {}

  async findAllValidIncoming(
    {
      nationalId,
      domainName,
      validity = DelegationValidity.NOW,
    }: FindAllValidIncomingOptions,
    useMaster = false,
    user?: User,
  ): Promise<DelegationDTO[]> {
    const { delegations, fromNameInfo } = await this.findAllIncoming(
      {
        nationalId,
        validity,
        domainName,
      },
      useMaster,
      user,
    )

    const delegationDTOs = delegations.map((d) => d.toDTO())

    return delegationDTOs.map((d) => {
      const person = this.getPersonByNationalId(fromNameInfo, d.fromNationalId)

      return {
        ...d,
        fromName: person?.name ?? d.fromName ?? UNKNOWN_NAME,
      }
    })
  }

  async findAllValidGeneralMandate(
    { nationalId }: FindAllValidIncomingOptions,
    useMaster = false,
    user?: User,
  ): Promise<DelegationDTO[]> {
    const { delegations, fromNameInfo } =
      await this.findAllIncomingGeneralMandates(
        {
          nationalId,
        },
        useMaster,
        user,
      )

    return delegations.map((delegation) => {
      const delegationDTO = delegation.toDTO(AuthDelegationType.GeneralMandate)

      const person = this.getPersonByNationalId(
        fromNameInfo,
        delegationDTO.fromNationalId,
      )

      return {
        ...delegationDTO,
        fromName: person?.name ?? delegationDTO.fromName ?? UNKNOWN_NAME,
      }
    })
  }

  async findAllAvailableIncoming(
    user: User,
    clientAllowedApiScopes: ApiScopeInfo[],
    requireApiScopes?: boolean,
  ): Promise<MergedDelegationDTO[]> {
    const customApiScopes = clientAllowedApiScopes.filter((s) =>
      s.supportedDelegationTypes?.some(
        (dt) => dt.delegationType == AuthDelegationType.Custom,
      ),
    )
    if (requireApiScopes && !(customApiScopes && customApiScopes.length > 0)) {
      return []
    }

    const { delegations, fromNameInfo } = await this.findAllIncoming(
      {
        nationalId: user.nationalId,
        validity: DelegationValidity.NOW,
      },
      false,
      user,
    )

    const validDelegations = delegations
      .map((d) => {
        d.delegationScopes = d.delegationScopes?.filter((s) =>
          this.checkIfScopeIsValid(s, customApiScopes),
        )
        return d
      })
      .filter((d) => d.delegationScopes && d.delegationScopes.length > 0)

    const protectedScopes = customApiScopes.filter((s) => s.isAccessControlled)

    const accessControlList = await this.findAccessControlList(
      delegations,
      protectedScopes,
    )
    const allowedDelegations = validDelegations
      .map((d) => {
        d.delegationScopes = d.delegationScopes?.filter((s) =>
          this.checkIfScopeAllowed(
            s,
            customApiScopes,
            accessControlList,
            d.fromNationalId,
          ),
        )
        return d
      })
      .filter(
        (d) =>
          !requireApiScopes ||
          (d.delegationScopes && d.delegationScopes.length > 0),
      )

    const mergedDelegationDTOs = uniqBy(
      allowedDelegations.map((d) => d.toMergedDTO()),
      'fromNationalId',
    )

    return mergedDelegationDTOs.map((d) => {
      const person = this.getPersonByNationalId(fromNameInfo, d.fromNationalId)

      return {
        ...d,
        fromName: person?.name ?? d.fromName ?? UNKNOWN_NAME,
      }
    })
  }

  private filterByCustomScopeRule(scope: ApiScopeInfo) {
    const foundCSR = this.delegationConfig.customScopeRules.find(
      (csr) => csr.scopeName === scope.name,
    )

    if (!foundCSR) {
      return true
    }

    return foundCSR.onlyForDelegationType.includes(
      AuthDelegationType.GeneralMandate,
    )
  }

  async findAllAvailableGeneralMandate(
    user: User,
    clientAllowedApiScopes: ApiScopeInfo[],
    requireApiScopes: boolean,
  ): Promise<MergedDelegationDTO[]> {
    const customApiScopes = clientAllowedApiScopes.filter(
      (s) =>
        !s.isAccessControlled &&
        this.filterByCustomScopeRule(s) &&
        s.supportedDelegationTypes?.some(
          (dt) => dt.delegationType === AuthDelegationType.GeneralMandate,
        ),
    )

    if (requireApiScopes && !(customApiScopes && customApiScopes.length > 0)) {
      return []
    }

    const { delegations, fromNameInfo } =
      await this.findAllIncomingGeneralMandates(
        {
          nationalId: user.nationalId,
        },
        false,
        user,
      )

    const mergedDelegationDTOs = uniqBy(
      delegations.map((d) =>
        d.toMergedDTO([AuthDelegationType.GeneralMandate]),
      ),
      'fromNationalId',
    )

    return mergedDelegationDTOs.map((d) => {
      const person = this.getPersonByNationalId(fromNameInfo, d.fromNationalId)

      return {
        ...d,
        fromName: person?.name ?? d.fromName ?? UNKNOWN_NAME,
      } as MergedDelegationDTO
    })
  }

  private async findAllIncomingGeneralMandates(
    { nationalId }: FindAllValidIncomingOptions,
    useMaster = false,
    user?: User,
  ): Promise<{ delegations: Delegation[]; fromNameInfo: NameInfo[] }> {
    const startOfToday = startOfDay(new Date())

    const delegations = await this.delegationModel.findAll({
      useMaster,
      where: {
        toNationalId: nationalId,
      },
      include: [
        {
          model: DelegationDelegationType,
          where: {
            validTo: {
              [Op.or]: {
                [Op.gte]: startOfToday,
                [Op.is]: null,
              },
            },
            delegationTypeId: AuthDelegationType.GeneralMandate,
          },
        },
      ],
    })

    // Check live status, i.e. dead or alive for delegations
    const isNationalRegistryV3DeceasedStatusEnabled =
      await this.nationalRegistryV3FeatureService.getValue(user)

    const { aliveNationalIds, deceasedNationalIds, aliveNameInfo } =
      await this.aliveStatusService.getStatus(
        delegations.map((d) => d.fromNationalId),
        isNationalRegistryV3DeceasedStatusEnabled,
      )

    if (deceasedNationalIds.length > 0) {
      const deceasedDelegations = delegations.filter((d) =>
        deceasedNationalIds.includes(d.fromNationalId),
      )
      // Delete all deceased delegations by deleting them and their scopes.
      const deletePromises = deceasedDelegations.map((delegation) =>
        delegation.destroy(),
      )

      await Promise.all(deletePromises)

      this.auditService.audit({
        action: 'deleteDelegationsForMissingPeople',
        resources: deceasedDelegations.map(({ id }) => id).filter(isDefined),
        system: true,
      })
    }

    return {
      delegations: delegations.filter((d) =>
        aliveNationalIds.includes(d.fromNationalId),
      ),
      fromNameInfo: aliveNameInfo,
    }
  }

  private async findAllIncoming(
    {
      nationalId,
      domainName,
      validity,
    }: FindAllValidIncomingOptions & {
      validity: DelegationValidity
    },
    useMaster = false,
    user?: User,
  ): Promise<{ delegations: Delegation[]; fromNameInfo: NameInfo[] }> {
    let whereOptions = getScopeValidityWhereClause(validity)
    if (domainName) whereOptions = { ...whereOptions, domainName: domainName }

    const delegations = await this.delegationModel.findAll({
      useMaster,
      where: {
        toNationalId: nationalId,
      },
      include: [
        {
          model: DelegationScope,
          required: true,
          where: whereOptions,
          include: [
            {
              model: ApiScope,
              as: 'apiScope',
              required: true,
              where: {
                enabled: true,
              },
              include: [
                {
                  model: ApiScopeDelegationType,
                  required: true,
                  where: {
                    delegationType: AuthDelegationType.Custom,
                  },
                },
              ],
            },
          ],
        },
      ],
    })

    // Check live status, i.e. dead or alive for delegations
    const isNationalRegistryV3DeceasedStatusEnabled =
      await this.nationalRegistryV3FeatureService.getValue(user)

    const { aliveNationalIds, deceasedNationalIds, aliveNameInfo } =
      await this.aliveStatusService.getStatus(
        delegations.map((d) => d.fromNationalId),
        isNationalRegistryV3DeceasedStatusEnabled,
      )

    if (deceasedNationalIds.length > 0) {
      const deceasedDelegations = delegations.filter((d) =>
        deceasedNationalIds.includes(d.fromNationalId),
      )
      // Delete all deceased delegations by deleting them and their scopes.
      const deletePromises = deceasedDelegations.map((delegation) =>
        delegation.destroy(),
      )

      await Promise.all(deletePromises)

      this.auditService.audit({
        action: 'deleteDelegationsForMissingPeople',
        resources: deceasedDelegations.map(({ id }) => id).filter(isDefined),
        system: true,
      })
    }

    return {
      delegations: delegations.filter((d) =>
        aliveNationalIds.includes(d.fromNationalId),
      ),
      fromNameInfo: aliveNameInfo,
    }
  }

  private checkIfScopeIsValid(
    scope: DelegationScope,
    customApiScopes: ApiScopeInfo[],
  ): boolean {
    return customApiScopes.some((s) => s.name === scope.scopeName)
  }

  private checkIfScopeAllowed(
    scope: DelegationScope,
    customApiScopes: ApiScopeInfo[],
    accesses: ApiScopeUserAccess[],
    fromNationalId: string,
  ): boolean {
    const protectedScope = customApiScopes.find(
      (s) => s.name === scope.scopeName && s.isAccessControlled,
    )

    if (!protectedScope) {
      return true
    }

    const access = accesses.find(
      (a) => a.scope === scope.scopeName && a.nationalId === fromNationalId,
    )

    if (access) {
      return kennitala.isCompany(fromNationalId)
    }

    return false
  }

  /**
   * Finds person by nationalId.
   */
  private getPersonByNationalId(
    identities: Array<NameInfo | null>,
    nationalId: string,
  ) {
    return identities.find((identity) => identity?.nationalId === nationalId)
  }

  private async findAccessControlList(
    delegations: Delegation[],
    protectedScopes: ApiScopeInfo[],
  ): Promise<ApiScopeUserAccess[]> {
    if (
      !delegations ||
      delegations.length === 0 ||
      !protectedScopes ||
      protectedScopes.length === 0
    )
      return []

    const nationalIds = delegations.map((d) => d.fromNationalId)

    return await this.apiScopeUserAccessModel.findAll({
      where: {
        [Op.and]: [
          { nationalId: { [Op.in]: nationalIds } },
          { scope: { [Op.in]: protectedScopes.map((s) => s.name) } },
        ],
      },
    })
  }
}
