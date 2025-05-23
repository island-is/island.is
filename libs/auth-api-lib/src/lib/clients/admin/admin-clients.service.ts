import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import omit from 'lodash/omit'
import { Includeable, Op, Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import { User } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { validateClientId } from '@island.is/auth/shared'
import { NoContentException } from '@island.is/nest/problem'
import { AuthDelegationType } from '@island.is/shared/types'

import { AdminScopeDTO } from '../../resources/admin/dto/admin-scope.dto'
import { AdminTranslationService } from '../../resources/admin/services/admin-translation.service'
import { ApiScope } from '../../resources/models/api-scope.model'
import { Domain } from '../../resources/models/domain.model'
import { TranslatedValueDto } from '../../translation/dto/translated-value.dto'
import { TranslationService } from '../../translation/translation.service'
import {
  ClientSso,
  ClientType,
  GrantTypeEnum,
  RefreshTokenExpiration,
  translateRefreshTokenExpiration,
} from '../../types'
import { ClientsService } from '../clients.service'
import { ClientAllowedScope } from '../models/client-allowed-scope.model'
import { ClientClaim } from '../models/client-claim.model'
import { ClientGrantType } from '../models/client-grant-type.model'
import { ClientPostLogoutRedirectUri } from '../models/client-post-logout-redirect-uri.model'
import { ClientRedirectUri } from '../models/client-redirect-uri.model'
import { Client } from '../models/client.model'
import { AdminClientClaimDto } from './dto/admin-client-claim.dto'
import { AdminClientDto } from './dto/admin-client.dto'
import { AdminCreateClientDto } from './dto/admin-create-client.dto'
import {
  AdminPatchClientDto,
  superUserFields,
} from './dto/admin-patch-client.dto'
import { ClientDelegationType } from '../models/client-delegation-type.model'
import {
  delegationTypeSuperUserFilter,
  SUPER_USER_DELEGATION_TYPES,
} from '../../resources/utils/filters'

export const clientBaseAttributes: Partial<Client> = {
  absoluteRefreshTokenLifetime: 8 * 60 * 60, // 8 hours
  accessTokenLifetime: 5 * 60, // 5 minutes
  allowOfflineAccess: true,
  allowRememberConsent: true,
  alwaysIncludeUserClaimsInIdToken: true,
  alwaysSendClientClaims: true,
  identityTokenLifetime: 5 * 60, // 5 minutes
  refreshTokenExpiration: 1, //RefreshTokenExpiration.Absolute,
  refreshTokenUsage: 1, // Single usage
  requireClientSecret: true,
  requirePkce: true,
  slidingRefreshTokenLifetime: 20 * 60, // 20 minutes
  updateAccessTokenClaimsOnRefresh: true,
  sso: ClientSso.Enabled,
}

@Injectable()
export class AdminClientsService {
  constructor(
    @InjectModel(Client)
    private clientModel: typeof Client,
    @InjectModel(Domain)
    private readonly domainModel: typeof Domain,
    @InjectModel(ClientRedirectUri)
    private clientRedirectUriModel: typeof ClientRedirectUri,
    @InjectModel(ClientPostLogoutRedirectUri)
    private clientPostLogoutRedirectUriModel: typeof ClientPostLogoutRedirectUri,
    @InjectModel(ClientClaim)
    private clientClaimModel: typeof ClientClaim,
    @InjectModel(ClientGrantType)
    private readonly clientGrantType: typeof ClientGrantType,
    @InjectModel(ClientAllowedScope)
    private readonly clientAllowedScope: typeof ClientAllowedScope,
    @InjectModel(ClientDelegationType)
    private readonly clientDelegationType: typeof ClientDelegationType,
    @InjectModel(ApiScope)
    private readonly apiScopeModel: typeof ApiScope,
    private readonly translationService: TranslationService,
    private readonly clientsService: ClientsService,
    private readonly adminTranslationService: AdminTranslationService,
    private sequelize: Sequelize,
  ) {}

  async findByTenantId(tenantId: string): Promise<AdminClientDto[]> {
    const clients = await this.clientModel.findAll({
      where: {
        domainName: tenantId,
        archived: null,
      },
      include: this.clientInclude(),
    })
    const clientTranslations = await this.translationService.findTranslationMap(
      'client',
      clients.map((client) => client.clientId),
    )

    return clients.map((client) =>
      this.formatClient(client, clientTranslations.get(client.clientId)),
    )
  }

  async findByTenantIdAndClientId(
    tenantId: string,
    clientId: string,
    includeArchived = false,
    useMaster = false,
  ): Promise<AdminClientDto> {
    const client = await this.clientModel.findOne({
      useMaster,
      where: {
        clientId,
        domainName: tenantId,
        enabled: true,
        ...(!includeArchived && { archived: null }),
      },
      include: this.clientInclude(),
    })

    if (!client) {
      throw new NoContentException()
    }

    const clientTranslation = await this.translationService.findTranslationMap(
      'client',
      [client.clientId],
      useMaster,
    )

    return this.formatClient(client, clientTranslation.get(client.clientId))
  }

  async create(
    clientDto: AdminCreateClientDto,
    user: User,
    tenantId: string,
  ): Promise<AdminClientDto> {
    const tenant = await this.domainModel.findOne({
      useMaster: true,
      where: {
        name: tenantId,
      },
    })
    if (!tenant) {
      throw new NoContentException()
    }

    const existingClient = await this.clientModel.findOne({
      useMaster: true,
      where: {
        clientId: clientDto.clientId,
        domainName: tenantId,
      },
    })

    if (existingClient) {
      throw new BadRequestException('Client already exists')
    }

    if (
      !validateClientId({
        prefix: tenantId,
        value: clientDto.clientId,
      })
    ) {
      throw new BadRequestException('Invalid client id')
    }

    const {
      customClaims,
      displayName,
      redirectUris,
      postLogoutRedirectUris,
      supportTokenExchange,
      refreshTokenExpiration,
      addedScopes,
      removedScopes,
      ...clientAttributes
    } = clientDto

    const { clientId } = await this.sequelize.transaction(
      async (transaction) => {
        const client = await this.clientModel.create(
          {
            clientId: clientDto.clientId,
            clientType: clientDto.clientType,
            domainName: tenantId,
            nationalId: tenant.nationalId,
            clientName: clientDto.clientName,
            contactEmail: clientDto.contactEmail,
            ...this.defaultClientAttributes(clientDto.clientType),
          },
          { transaction },
        )

        await this.updateConnectionsForClient(transaction, {
          clientId: client.clientId,
          tenantId,
          displayName,
          refreshTokenExpiration,
          clientAttributes: {
            ...clientAttributes,
            addedDelegationTypes: clientAttributes.supportedDelegationTypes,
          },
          redirectUris,
          postLogoutRedirectUris,
          customClaims,
          supportTokenExchange,
          addedScopes,
          removedScopes,
        })

        await this.clientGrantType.create(this.defaultClientGrantType(client), {
          transaction,
        })
        await this.clientAllowedScope.bulkCreate(
          this.defaultClientScopes(client),
          {
            transaction,
          },
        )

        return client
      },
    )

    return this.findByTenantIdAndClientId(tenantId, clientId, false, true)
  }

  async delete(clientId: string, tenantId: string) {
    const client = await this.clientModel.findOne({
      where: {
        clientId,
        domainName: tenantId,
      },
    })

    if (!client || client.archived) {
      return
    }

    await this.clientModel.update(
      {
        archived: Date.now(),
        enabled: false,
      },
      {
        where: {
          clientId,
          domainName: tenantId,
        },
      },
    )

    return
  }

  async update(
    user: User,
    tenantId: string,
    clientId: string,
    input: AdminPatchClientDto,
  ): Promise<AdminClientDto> {
    if (Object.keys(input).length === 0) {
      throw new BadRequestException('No fields provided to update.')
    }

    const client = await this.clientModel.findOne({
      where: {
        clientId,
        domainName: tenantId,
      },
    })
    if (!client) {
      throw new NoContentException()
    }

    const isValid = await this.validateUserUpdateAccess(user, input, tenantId)
    if (!isValid) {
      throw new ForbiddenException(
        'User does not have access to update admin controlled fields.',
      )
    }

    const {
      customClaims,
      displayName,
      redirectUris,
      postLogoutRedirectUris,
      supportTokenExchange,
      refreshTokenExpiration,
      addedScopes,
      removedScopes,
      ...clientAttributes
    } = input

    await this.sequelize.transaction(async (transaction) => {
      await this.updateConnectionsForClient(transaction, {
        clientId,
        tenantId,
        displayName,
        refreshTokenExpiration,
        clientAttributes,
        redirectUris,
        postLogoutRedirectUris,
        customClaims,
        supportTokenExchange,
        addedScopes,
        removedScopes,
      })
    })

    return this.findByTenantIdAndClientId(tenantId, clientId)
  }

  private async updateClientUris(
    model: typeof ClientRedirectUri | typeof ClientPostLogoutRedirectUri,
    clientId: string,
    uris: string[],
    transaction: Transaction,
  ) {
    await Promise.all(
      uris.map((uri) =>
        model.upsert(
          {
            clientId,
            redirectUri: uri,
          },
          { transaction, fields: ['redirect_uri'] },
        ),
      ),
    )

    await model.destroy({
      where: {
        clientId,
        redirectUri: {
          [Op.notIn]: uris,
        },
      },
      transaction,
    })
  }

  private async updateCustomClaims(
    clientId: string,
    customClaims: AdminClientClaimDto[],
    transaction: Transaction,
  ) {
    await Promise.all(
      customClaims.map((claim) =>
        this.clientClaimModel.upsert(
          {
            clientId,
            type: claim.type,
            value: claim.value,
          },
          { transaction, fields: ['value'] },
        ),
      ),
    )

    await this.clientClaimModel.destroy({
      where: {
        clientId,
        value: {
          [Op.notIn]: customClaims.map((claim) => claim.value),
        },
      },
      transaction,
    })
  }

  private async updateConnectionsForClient(
    transaction: Transaction,
    data: {
      clientId: string
      tenantId?: string
      displayName?: TranslatedValueDto[]
      refreshTokenExpiration?: RefreshTokenExpiration
      clientAttributes: Omit<
        AdminPatchClientDto,
        | 'customClaims'
        | 'displayName'
        | 'redirectUris'
        | 'postLogoutRedirectUris'
        | 'supportTokenExchange'
        | 'refreshTokenExpiration'
      >
      redirectUris?: string[]
      postLogoutRedirectUris?: string[]
      customClaims?: AdminClientClaimDto[]
      supportTokenExchange?: boolean
      addedScopes?: string[]
      removedScopes?: string[]
    },
  ) {
    const {
      addedDelegationTypes,
      removedDelegationTypes,
      supportsCustomDelegation,
      supportsProcuringHolders,
      supportsPersonalRepresentatives,
      supportsLegalGuardians,
      ...clientAttributes
    } = data.clientAttributes

    if (Object.keys(clientAttributes as object).length > 0) {
      // Update includes client base attributes
      const refreshTokenExpiration = data.refreshTokenExpiration
        ? translateRefreshTokenExpiration(data.refreshTokenExpiration)
        : undefined

      await this.clientModel.update(
        {
          ...clientAttributes,
          refreshTokenExpiration,
        },
        {
          where: {
            clientId: data.clientId,
          },
          transaction,
        },
      )
    }

    if (data.displayName && data.displayName.length > 0) {
      await this.updateDisplayName(data.clientId, data.displayName, transaction)
    }

    if (data.redirectUris && data.redirectUris.length > 0) {
      await this.updateClientUris(
        ClientRedirectUri,
        data.clientId,
        data.redirectUris,
        transaction,
      )
    }

    if (data.postLogoutRedirectUris && data.postLogoutRedirectUris.length > 0) {
      await this.updateClientUris(
        ClientPostLogoutRedirectUri,
        data.clientId,
        data.postLogoutRedirectUris,
        transaction,
      )
    }

    if (data.customClaims) {
      await this.updateCustomClaims(
        data.clientId,
        data.customClaims,
        transaction,
      )
    }

    if (
      (data.addedScopes && data.addedScopes.length > 0) ||
      (data.removedScopes && data.removedScopes.length > 0)
    ) {
      await this.updateClientAllowedScopes({
        addedScopes: data.addedScopes,
        removedScopes: data.removedScopes,
        transaction,
        clientId: data.clientId,
      })
    }

    // Checking if the value is true and boolean to avoid undefined
    if (data.supportTokenExchange === true) {
      await this.clientGrantType.upsert(
        {
          clientId: data.clientId,
          grantType: GrantTypeEnum.TokenExchange,
        },
        { transaction, fields: ['grant_type'] },
      )
    }

    // Checking if the value is false and boolean to avoid undefined
    if (data.supportTokenExchange === false) {
      await this.clientGrantType.destroy({
        where: {
          clientId: data.clientId,
          grantType: GrantTypeEnum.TokenExchange,
        },
        transaction,
      })
    }

    if (addedDelegationTypes && addedDelegationTypes.length > 0) {
      await this.clientsService.addClientDelegationTypes({
        clientId: data.clientId,
        delegationTypes: addedDelegationTypes,
        options: {
          transaction,
        },
      })
    }

    if (removedDelegationTypes && removedDelegationTypes.length > 0) {
      await this.clientsService.removeClientDelegationTypes({
        clientId: data.clientId,
        delegationTypes: removedDelegationTypes,
        options: {
          transaction,
        },
      })
    }
  }

  private defaultClientAttributes(clientType: ClientType) {
    switch (clientType) {
      case ClientType.web:
        return clientBaseAttributes
      case ClientType.native:
        return {
          ...clientBaseAttributes,
          absoluteRefreshTokenLifetime: 365 * 24 * 60 * 60, // 1 year
          requireClientSecret: false,
          slidingRefreshTokenLifetime: 90 * 24 * 60 * 60, // 3 months
        }
      case ClientType.machine:
        return {
          ...clientBaseAttributes,
          allowOfflineAccess: false,
          requirePkce: false,
        }
      default:
        throw new Error(`Unknown client type: ${clientType}`)
    }
  }

  private formatClient(
    client: Client,
    translations?: Map<string, Map<string, string>>,
  ): AdminClientDto {
    return {
      clientId: client.clientId,
      clientType: client.clientType,
      sso: client.sso,
      tenantId: client.domainName ?? '',
      displayName: this.adminTranslationService.createTranslatedValueDTOs({
        key: 'clientName',
        defaultValueIS: client.clientName ?? '',
        translations,
      }),
      absoluteRefreshTokenLifetime: client.absoluteRefreshTokenLifetime,
      slidingRefreshTokenLifetime: client.slidingRefreshTokenLifetime,
      refreshTokenExpiration:
        client.refreshTokenExpiration === 0
          ? RefreshTokenExpiration.Sliding
          : RefreshTokenExpiration.Absolute,
      supportsCustomDelegation: client.supportsCustomDelegation,
      supportsLegalGuardians: client.supportsLegalGuardians,
      supportsProcuringHolders: client.supportsProcuringHolders,
      supportsPersonalRepresentatives: client.supportsPersonalRepresentatives,
      promptDelegations: client.promptDelegations,
      requireApiScopes: client.requireApiScopes,
      requireConsent: client.requireConsent,
      allowOfflineAccess: client.allowOfflineAccess,
      requirePkce: client.requirePkce,
      accessTokenLifetime: client.accessTokenLifetime,
      singleSession: client.singleSession,
      redirectUris: client.redirectUris?.map((uri) => uri.redirectUri) ?? [],
      postLogoutRedirectUris:
        client.postLogoutRedirectUris?.map((uri) => uri.redirectUri) ?? [],
      supportTokenExchange:
        client.allowedGrantTypes?.some(
          (grantType) => grantType.grantType === GrantTypeEnum.TokenExchange,
        ) ?? false,
      customClaims:
        client.claims?.map((claim) => ({
          type: claim.type,
          value: claim.value,
        })) ?? [],
      supportedDelegationTypes:
        client.supportedDelegationTypes?.map(
          (clientDelegationType) => clientDelegationType.delegationType,
        ) ?? [],
      allowedAcr: client.allowedAcr.map((v) => v.toString()) ?? [],
    }
  }

  private defaultClientGrantType(client: Client) {
    switch (client.clientType) {
      case ClientType.web:
      case ClientType.native:
        return {
          clientId: client.clientId,
          grantType: 'authorization_code',
        }
      case ClientType.machine:
        return {
          clientId: client.clientId,
          grantType: 'client_credentials',
        }
    }
  }

  private defaultClientScopes(client: Client) {
    const scopes = [
      {
        clientId: client.clientId,
        scopeName: 'openid',
      },
    ]

    switch (client.clientType) {
      case ClientType.web:
      case ClientType.native:
        scopes.push(
          ...[
            {
              clientId: client.clientId,
              scopeName: 'profile',
            },
            {
              clientId: client.clientId,
              scopeName: 'email',
            },
            {
              clientId: client.clientId,
              scopeName: 'phone',
            },
            {
              clientId: client.clientId,
              scopeName: 'address',
            },
          ],
        )
    }

    return scopes
  }

  private clientInclude(): Includeable[] {
    return [
      { model: ClientClaim, as: 'claims' },
      { model: ClientGrantType, as: 'allowedGrantTypes' },
      { model: ClientRedirectUri, as: 'redirectUris' },
      { model: ClientPostLogoutRedirectUri, as: 'postLogoutRedirectUris' },
      { model: ClientDelegationType, as: 'supportedDelegationTypes' },
    ]
  }

  /**
   * Validates that the user has access to update the fields in the input.
   * If the user is a superuser, they can update all fields.
   * If the user is not a superuser, they can only update non-admin fields.
   */
  private async validateUserUpdateAccess(
    user: User,
    input: AdminPatchClientDto,
    tenantId: string,
  ) {
    const isSuperUser = this.isSuperAdmin(user)

    // Verify if superuser delegation types are being updated that user is super user
    const allDelegationTypes = [
      ...(input.removedDelegationTypes ?? []),
      ...(input.addedDelegationTypes ?? []),
    ]

    const hasSuperUserDelegationType = allDelegationTypes.some(
      (delegationType) => SUPER_USER_DELEGATION_TYPES.includes(delegationType),
    )

    if (!isSuperUser && hasSuperUserDelegationType) {
      return false
    }

    const updatedFields = Object.keys(input)
    const superUserUpdatedFields = updatedFields.filter((field) =>
      superUserFields.includes(field),
    )

    if (superUserUpdatedFields.length === 0) {
      // There are no superuser fields to update
      return true
    }

    if (superUserUpdatedFields.length > 0 && isSuperUser) {
      // There are some superuser fields to update and the user has the superuser scope
      return true
    }

    if (input.addedScopes && input.addedScopes.length > 0) {
      const verifiedScopes = await this.verifyScopeNames({
        isSuperUser,
        scopeNames: input.addedScopes,
        tenantId,
      })

      if (verifiedScopes) {
        return true
      }
    }

    // There are some superuser fields to update and the user does not have the superuser scope
    return false
  }

  private async updateDisplayName(
    clientId: string,
    displayName: TranslatedValueDto[],
    transaction: Transaction,
  ) {
    const clientName = displayName.find((name) => name.locale === 'is')?.value

    if (!clientName) {
      throw new BadRequestException('Client name in Icelandic is required')
    }

    const translationNames = displayName.filter((name) => name.locale !== 'is')

    // Update client name
    await this.clientModel.update(
      { clientName },
      { where: { clientId }, transaction },
    )

    // Update or create translations
    await Promise.all(
      translationNames.map((name) => {
        if (name.value) {
          this.translationService.upsertTranslation({
            className: 'client',
            key: clientId,
            language: name.locale,
            property: 'clientName',
            value: name.value,
          })
        }
      }),
    )
  }

  /**
   * Verifies that the scopes exist and are enabled for the tenant.
   * @returns true if all scopes exist, are enabled and have the same tenant, false otherwise.
   */
  private async verifyScopeNames({
    isSuperUser,
    scopeNames,
    tenantId,
  }: {
    isSuperUser: boolean
    scopeNames: string[]
    tenantId: string
  }): Promise<boolean> {
    const scopes = await this.apiScopeModel.findAndCountAll({
      where: {
        name: {
          [Op.in]: scopeNames,
        },
        archived: null,
        ...(isSuperUser ? {} : { domainName: tenantId }),
      },
    })

    return scopes.count === scopeNames.length
  }

  private async updateClientAllowedScopes({
    addedScopes,
    removedScopes,
    clientId,
    transaction,
  }: {
    addedScopes?: string[]
    removedScopes?: string[]
    clientId: string
    transaction: Transaction
  }): Promise<void> {
    if (removedScopes) {
      await this.clientsService.removeAllowedScopes(removedScopes, clientId, {
        transaction,
      })
    }

    if (addedScopes) {
      await this.clientsService.addAllowedScopes(addedScopes, clientId, {
        transaction,
        ignoreDuplicates: true,
      })
    }
  }

  async findAllowedScopes({
    clientId,
    tenantId,
  }: {
    clientId: string
    tenantId: string
  }): Promise<AdminScopeDTO[]> {
    const client = await this.clientModel.findOne({
      where: {
        clientId,
        domainName: tenantId,
        enabled: true,
      },
      include: {
        model: ClientAllowedScope,
        as: 'allowedScopes',
        where: {
          scopeName: {
            [Op.notIn]: Sequelize.literal(
              `(SELECT name FROM identity_resource)`,
            ),
          },
        },
        required: false,
      },
    })

    if (!client) {
      throw new NoContentException()
    } else if (!client?.allowedScopes?.length) {
      return []
    }

    const scopeNames = client.allowedScopes.map((scope) => scope.scopeName)

    const apiScopes = await this.apiScopeModel.findAll({
      where: {
        name: {
          [Op.in]: scopeNames,
        },
        enabled: true,
      },
    })

    const translations =
      await this.adminTranslationService.getApiScopeTranslations(
        apiScopes.map(({ name }) => name),
      )

    return apiScopes
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((apiScope) =>
        this.adminTranslationService.mapApiScopeToAdminScopeDTO(
          apiScope,
          translations,
        ),
      )
  }

  private isSuperAdmin = (user: User) => {
    return user.scope.includes(AdminPortalScope.idsAdminSuperUser)
  }
}
