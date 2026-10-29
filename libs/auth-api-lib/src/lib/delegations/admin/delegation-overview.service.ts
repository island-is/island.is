import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import startOfDay from 'date-fns/startOfDay'
import * as kennitala from 'kennitala'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
import { Op } from 'sequelize'

import { User } from '@island.is/auth-nest-tools'
import type { ConfigType } from '@island.is/nest/config'
import { AuthDelegationType } from '@island.is/shared/types'

import { ClientAllowedScope } from '../../clients/models/client-allowed-scope.model'
import { ClientDelegationType } from '../../clients/models/client-delegation-type.model'
import { Client } from '../../clients/models/client.model'
import { ClientType } from '../../types'
import { ApiScopeDelegationType } from '../../resources/models/api-scope-delegation-type.model'
import { ApiScopeUserAccess } from '../../resources/models/api-scope-user-access.model'
import { ApiScope } from '../../resources/models/api-scope.model'
import { Domain } from '../../resources/models/domain.model'
import { DelegationConfig } from '../DelegationConfig'
import { DelegationDTO } from '../dto/delegation.dto'
import {
  DelegationOverviewClientDto,
  DelegationOverviewDelegationDto,
  DelegationOverviewDto,
  DelegationOverviewScopeDto,
} from '../dto/delegation-overview.dto'
import { DelegationDelegationType } from '../models/delegation-delegation-type.model'
import { DelegationScope } from '../models/delegation-scope.model'
import { Delegation } from '../models/delegation.model'
import {
  DelegationIndexLookupService,
  IndexedDelegation,
} from './delegation-index-lookup.service'

interface ScopeInfo {
  displayName: string
  delegationTypes: Set<string>
  isAccessControlled: boolean
}

interface OrganizationClient {
  client: Client
  supportedTypes: Set<string>
  scopes: Map<string, ScopeInfo>
}

type AccessList = Set<string>

/** A delegation that grants access by its type rather than by scopes. */
interface TypeDelegation {
  id: string
  /** The type as stored, e.g. `PersonalRepresentative:postholf`. */
  storedType: string
  type: AuthDelegationType
  fromNationalId: string
  toNationalId: string
  validTo: Date | null
  indexedAt?: Date | null
}

/** Reads the tables directly since the login services delete delegations from deceased people. */
@Injectable()
export class DelegationOverviewService {
  constructor(
    @InjectModel(Client)
    private clientModel: typeof Client,
    @InjectModel(ApiScope)
    private apiScopeModel: typeof ApiScope,
    @InjectModel(ApiScopeUserAccess)
    private apiScopeUserAccessModel: typeof ApiScopeUserAccess,
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
    @Inject(DelegationConfig.KEY)
    private delegationConfig: ConfigType<typeof DelegationConfig>,
    private delegationIndexLookupService: DelegationIndexLookupService,
  ) {}

  async getDelegationsByNationalId(
    user: User,
    nationalId: string,
  ): Promise<DelegationOverviewDto> {
    const clients = await this.findOrganizationClients(user)

    if (clients.length === 0) {
      return { clients: [], incoming: [], outgoing: [] }
    }

    const [custom, generalMandates, indexRecords] = await Promise.all([
      this.findCustomDelegations(nationalId),
      this.findGeneralMandates(nationalId),
      // Custom delegations and general mandates are read from the delegation table.
      this.delegationIndexLookupService.findByNationalId(nationalId, [
        AuthDelegationType.Custom,
        AuthDelegationType.GeneralMandate,
      ]),
    ])
    const typeDelegations: TypeDelegation[] = [
      ...generalMandates,
      ...indexRecords.map(({ record, storedType, type, id, indexedAt }) => ({
        id,
        storedType,
        type,
        fromNationalId: record.fromNationalId,
        toNationalId: record.toNationalId,
        validTo: record.validTo ?? null,
        indexedAt,
      })),
    ]

    const accessList = await this.findAccessList(clients, [
      ...custom.map((d) => d.fromNationalId),
      ...typeDelegations.map((d) => d.fromNationalId),
    ])

    const overview = [
      ...custom.flatMap((d) => this.toCustomOverview(d, clients, accessList)),
      ...typeDelegations.flatMap((d) =>
        this.toTypeOverview(d, clients, accessList),
      ),
    ]

    return {
      clients: clients.map(toClientDto),
      incoming: overview.filter((d) => d.toNationalId === nationalId),
      outgoing: overview.filter((d) => d.fromNationalId === nationalId),
    }
  }

  private async findCustomDelegations(
    nationalId: string,
  ): Promise<DelegationDTO[]> {
    const delegations = await this.delegationModel.findAll({
      where: {
        [Op.or]: [{ toNationalId: nationalId }, { fromNationalId: nationalId }],
      },
      include: [
        {
          model: DelegationScope,
          required: true,
          include: [
            {
              model: ApiScope,
              as: 'apiScope',
              required: true,
              where: { enabled: true },
              attributes: ['name', 'displayName'],
              include: [
                {
                  model: ApiScopeDelegationType,
                  required: true,
                  where: { delegationType: AuthDelegationType.Custom },
                  attributes: [],
                },
              ],
            },
          ],
        },
      ],
    })

    return delegations.map((d) => d.toDTO())
  }

  private async findGeneralMandates(
    nationalId: string,
  ): Promise<TypeDelegation[]> {
    const delegations = await this.delegationModel.findAll({
      where: {
        [Op.or]: [{ toNationalId: nationalId }, { fromNationalId: nationalId }],
      },
      attributes: ['id', 'fromNationalId', 'toNationalId'],
      include: [
        {
          model: DelegationDelegationType,
          required: true,
          where: { delegationTypeId: AuthDelegationType.GeneralMandate },
          attributes: ['validTo'],
        },
      ],
    })

    return delegations.map((d) => ({
      id: d.id,
      storedType: AuthDelegationType.GeneralMandate,
      type: AuthDelegationType.GeneralMandate,
      fromNationalId: d.fromNationalId,
      toNationalId: d.toNationalId,
      validTo: d.delegationDelegationTypes?.[0]?.validTo ?? null,
    }))
  }

  private async findOrganizationClients(
    user: User,
  ): Promise<OrganizationClient[]> {
    const clients = await this.clientModel.findAll({
      where: {
        enabled: true,
        archived: null,
        clientType: { [Op.ne]: ClientType.machine },
      },
      attributes: ['clientId', 'clientName', 'domainName', 'requireApiScopes'],
      include: [
        {
          model: Domain,
          required: true,
          where: { nationalId: user.nationalId },
          attributes: [],
        },
        {
          model: ClientDelegationType,
          required: true,
          attributes: ['delegationType'],
        },
        {
          model: ClientAllowedScope,
          attributes: ['scopeName'],
        },
      ],
      order: [['clientName', 'ASC']],
    })

    const scopeNames = uniq(
      clients.flatMap((c) => (c.allowedScopes ?? []).map((s) => s.scopeName)),
    )
    const apiScopes = scopeNames.length
      ? await this.apiScopeModel.findAll({
          where: { name: scopeNames, enabled: true },
          attributes: ['name', 'displayName', 'isAccessControlled'],
          include: [
            {
              model: ApiScopeDelegationType,
              attributes: ['delegationType'],
            },
          ],
        })
      : []
    const scopeInfo = new Map<string, ScopeInfo>(
      apiScopes.map((scope) => [
        scope.name,
        {
          displayName: scope.displayName,
          delegationTypes: new Set(
            (scope.supportedDelegationTypes ?? []).map((t) => t.delegationType),
          ),
          isAccessControlled: !!scope.isAccessControlled,
        },
      ]),
    )

    return clients.map((client) => ({
      client,
      supportedTypes: new Set(
        (client.supportedDelegationTypes ?? []).map((t) => t.delegationType),
      ),
      scopes: new Map(
        (client.allowedScopes ?? []).flatMap(({ scopeName }) => {
          const info = scopeInfo.get(scopeName)
          return info ? [[scopeName, info] as const] : []
        }),
      ),
    }))
  }

  private async findAccessList(
    clients: OrganizationClient[],
    fromNationalIds: string[],
  ): Promise<AccessList> {
    const protectedScopes = uniq(
      clients.flatMap(({ scopes }) =>
        [...scopes]
          .filter(([, scope]) => scope.isAccessControlled)
          .map(([name]) => name),
      ),
    )

    if (protectedScopes.length === 0 || fromNationalIds.length === 0) {
      return new Set()
    }

    const accesses = await this.apiScopeUserAccessModel.findAll({
      where: { scope: protectedScopes, nationalId: uniq(fromNationalIds) },
      attributes: ['scope', 'nationalId'],
    })

    return new Set(accesses.map((a) => `${a.scope}:${a.nationalId}`))
  }

  /** Mirrors checkIfScopeAllowed at login, not which scopes a user may delegate onwards. */
  private grantsScopeAtLogin(
    scopeName: string,
    scope: ScopeInfo,
    delegationType: string,
    fromNationalId: string,
    accessList: AccessList,
  ): boolean {
    if (!scope.delegationTypes.has(delegationType)) {
      return false
    }

    return (
      !scope.isAccessControlled ||
      (accessList.has(`${scopeName}:${fromNationalId}`) &&
        kennitala.isCompany(fromNationalId))
    )
  }

  private toCustomOverview(
    delegation: DelegationDTO,
    clients: OrganizationClient[],
    accessList: AccessList,
  ): DelegationOverviewDelegationDto[] {
    const clientIds: string[] = []
    const loginClientIds: string[] = []
    const scopes: DelegationOverviewScopeDto[] = []

    for (const { client, supportedTypes, scopes: clientScopes } of clients) {
      if (!supportedTypes.has(AuthDelegationType.Custom)) {
        continue
      }

      const clientDelegationScopes = (delegation.scopes ?? []).filter((s) =>
        clientScopes
          .get(s.scopeName)
          ?.delegationTypes.has(AuthDelegationType.Custom),
      )

      const grantedScopes = clientDelegationScopes.filter((s) =>
        this.grantsScopeAtLogin(
          s.scopeName,
          clientScopes.get(s.scopeName) as ScopeInfo,
          AuthDelegationType.Custom,
          delegation.fromNationalId,
          accessList,
        ),
      )

      // A delegation applies to a client when it would work at login if valid.
      if (
        clientDelegationScopes.length === 0 ||
        (client.requireApiScopes && grantedScopes.length === 0)
      ) {
        continue
      }

      clientIds.push(client.clientId)
      if (
        clientDelegationScopes.some(isScopeValidNow) &&
        (!client.requireApiScopes || grantedScopes.some(isScopeValidNow))
      ) {
        loginClientIds.push(client.clientId)
      }

      scopes.push(
        ...clientDelegationScopes.map((s) => ({
          scopeName: s.scopeName,
          displayName: s.displayName,
          validFrom: s.validFrom,
          validTo: s.validTo ?? null,
        })),
      )
    }

    if (clientIds.length === 0 || !delegation.id) {
      return []
    }

    const delegationScopes = uniqBy(scopes, 'scopeName')

    return [
      {
        id: delegation.id,
        type: delegation.type,
        fromNationalId: delegation.fromNationalId,
        toNationalId: delegation.toNationalId,
        validTo: latestValidTo(delegationScopes),
        isActive: delegationScopes.some(isScopeValidNow),
        scopes: delegationScopes,
        clientIds,
        loginClientIds,
      },
    ]
  }

  /** General mandates mirror findAllAvailableGeneralMandate. */
  private grantedScopes(
    delegation: TypeDelegation,
    { supportedTypes, scopes }: OrganizationClient,
    accessList: AccessList,
  ): [string, ScopeInfo][] | null {
    if (delegation.storedType !== AuthDelegationType.GeneralMandate) {
      return supportedTypes.has(delegation.storedType)
        ? [...scopes].filter(([name, scope]) =>
            this.grantsScopeAtLogin(
              name,
              scope,
              delegation.storedType,
              delegation.fromNationalId,
              accessList,
            ),
          )
        : null
    }

    const types = [
      AuthDelegationType.GeneralMandate,
      ...(kennitala.isCompany(delegation.fromNationalId)
        ? [AuthDelegationType.ProcurationHolder]
        : []),
    ].filter((type) => supportedTypes.has(type))

    if (types.length === 0) {
      return null
    }

    return [...scopes].filter(
      ([name, scope]) =>
        !scope.isAccessControlled &&
        this.isAllowedForGeneralMandate(name) &&
        types.some((type) => scope.delegationTypes.has(type)),
    )
  }

  private isAllowedForGeneralMandate(scopeName: string) {
    const rule = this.delegationConfig.customScopeRules.find(
      (r) => r.scopeName === scopeName,
    )
    return (
      !rule ||
      rule.onlyForDelegationType.includes(AuthDelegationType.GeneralMandate)
    )
  }

  private toTypeOverview(
    delegation: TypeDelegation,
    clients: OrganizationClient[],
    accessList: AccessList,
  ): DelegationOverviewDelegationDto[] {
    const isActive =
      !delegation.validTo ||
      new Date(delegation.validTo) >= startOfDay(new Date())
    const clientIds: string[] = []
    const loginClientIds: string[] = []
    const scopes: DelegationOverviewScopeDto[] = []

    for (const orgClient of clients) {
      const grantedScopes = this.grantedScopes(
        delegation,
        orgClient,
        accessList,
      )

      if (
        !grantedScopes ||
        (orgClient.client.requireApiScopes && grantedScopes.length === 0)
      ) {
        continue
      }

      clientIds.push(orgClient.client.clientId)
      if (isActive) {
        loginClientIds.push(orgClient.client.clientId)
      }
      scopes.push(
        ...grantedScopes.map(([scopeName, scope]) => ({
          scopeName,
          displayName: scope.displayName,
          validFrom: null,
          validTo: delegation.validTo,
        })),
      )
    }

    if (clientIds.length === 0) {
      return []
    }

    return [
      {
        id: delegation.id,
        type: delegation.type,
        fromNationalId: delegation.fromNationalId,
        toNationalId: delegation.toNationalId,
        validTo: delegation.validTo,
        isActive,
        indexedAt: delegation.indexedAt,
        scopes: uniqBy(scopes, 'scopeName'),
        clientIds,
        loginClientIds,
      },
    ]
  }
}

const toClientDto = ({
  client,
}: OrganizationClient): DelegationOverviewClientDto => ({
  clientId: client.clientId,
  clientName: client.clientName ?? null,
  domainName: client.domainName ?? '',
})

/** Same rule as `getScopeValidityWhereClause(DelegationValidity.NOW)`. */
const isScopeValidNow = (scope: {
  validFrom?: Date | null
  validTo?: Date | null
}) => {
  const startOfToday = startOfDay(new Date())
  return (
    (!scope.validFrom || new Date(scope.validFrom) <= startOfToday) &&
    (!scope.validTo || new Date(scope.validTo) >= startOfToday)
  )
}

const latestValidTo = (scopes: DelegationOverviewScopeDto[]): Date | null => {
  if (scopes.length === 0 || scopes.some((s) => !s.validTo)) {
    return null
  }

  return new Date(
    Math.max(...scopes.map((s) => new Date(s.validTo as Date).getTime())),
  )
}
