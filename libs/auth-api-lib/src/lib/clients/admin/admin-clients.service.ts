import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Includeable, Op, Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

import { User } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { NoContentException } from '@island.is/nest/problem'

import { Domain } from '../../resources/models/domain.model'
import { TranslatedValueDto } from '../../translation/dto/translated-value.dto'
import { TranslationService } from '../../translation/translation.service'
import { ClientType, GrantTypeEnum, RefreshTokenExpiration } from '../../types'
import { Client } from '../models/client.model'
import { ClientClaim } from '../models/client-claim.model'
import { ClientGrantType } from '../models/client-grant-type.model'
import { ClientRedirectUri } from '../models/client-redirect-uri.model'
import { ClientPostLogoutRedirectUri } from '../models/client-post-logout-redirect-uri.model'
import { AdminClientDto } from './dto/admin-client.dto'
import { AdminCreateClientDto } from './dto/admin-create-client.dto'
import {
  AdminPatchClientDto,
  superUserFields,
} from './dto/admin-patch-client.dto'
import { AdminClientClaimDto } from './dto/admin-client-claim.dto'

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
    private readonly translationService: TranslationService,
    private sequelize: Sequelize,
  ) {}

  async findByTenantId(tenantId: string): Promise<AdminClientDto[]> {
    const clients = await this.clientModel.findAll({
      where: {
        domainName: tenantId,
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
  ): Promise<AdminClientDto> {
    const client = await this.clientModel.findOne({
      where: {
        clientId,
        domainName: tenantId,
      },
      include: this.clientInclude(),
    })
    if (!client) {
      throw new NoContentException()
    }

    const clientTranslation = await this.translationService.findTranslationMap(
      'client',
      [client.clientId],
    )

    return this.formatClient(client, clientTranslation.get(client.clientId))
  }

  async create(
    clientDto: AdminCreateClientDto,
    user: User,
    tenantId: string,
  ): Promise<AdminClientDto> {
    const tenant = await this.domainModel.findOne({
      where: {
        name: tenantId,
      },
    })
    if (!tenant) {
      throw new NoContentException()
    }

    // validate that client id starts with the tenant id
    if (!clientDto.clientId.startsWith(`${tenantId}/`)) {
      throw new BadRequestException('Invalid client id')
    }

    const client = await this.clientModel.create({
      clientId: clientDto.clientId,
      clientType: clientDto.clientType,
      domainName: tenantId,
      nationalId: tenant.nationalId,
      clientName: clientDto.clientName,
      ...this.defaultClientAttributes(clientDto.clientType),
    })

    // TODO: Add client type specific openid profile identity resources
    await this.clientGrantType.create(this.defaultClientGrantTypes(client))

    return this.findByTenantIdAndClientId(tenantId, client.clientId)
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

    if (!this.validateUserUpdateAccess(user, input)) {
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
      ...clientAttributes
    } = input

    await this.sequelize.transaction(async (transaction) => {
      if (Object.keys(clientAttributes).length > 0) {
        // Update includes client base attributes
        await this.clientModel.update(
          {
            ...clientAttributes,
            refreshTokenExpiration:
              refreshTokenExpiration === RefreshTokenExpiration.Sliding ? 0 : 1,
          },
          {
            where: {
              clientId,
            },
            transaction,
          },
        )
      }

      if (displayName && displayName.length > 0) {
        await this.updateDisplayName(clientId, displayName, transaction)
      }

      if (redirectUris && redirectUris.length > 0) {
        await this.updateClientUris(
          ClientRedirectUri,
          clientId,
          redirectUris,
          transaction,
        )
      }

      if (postLogoutRedirectUris && postLogoutRedirectUris.length > 0) {
        await this.updateClientUris(
          ClientPostLogoutRedirectUri,
          clientId,
          postLogoutRedirectUris,
          transaction,
        )
      }

      if (customClaims && customClaims.length > 0) {
        await this.updateCustomClaims(clientId, customClaims, transaction)
      }

      // Checking if the value is true and boolean to avoid undefined
      if (supportTokenExchange === true) {
        await this.clientGrantType.upsert(
          {
            clientId,
            grantType: GrantTypeEnum.TokenExchange,
          },
          { transaction, fields: ['grant_type'] },
        )
      }

      // Checking if the value is false and boolean to avoid undefined
      if (supportTokenExchange === false) {
        await this.clientGrantType.destroy({
          where: {
            clientId,
            grantType: GrantTypeEnum.TokenExchange,
          },
          transaction,
        })
      }
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
      tenantId: client.domainName ?? '',
      displayName: this.formatDisplayName(client.clientName, translations),
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
    }
  }

  private formatDisplayName(
    clientName?: string,
    translations?: Map<string, Map<string, string>>,
  ): TranslatedValueDto[] {
    const displayNames = [{ locale: 'is', value: clientName ?? '' }]

    for (const [locale, translation] of translations?.entries() ?? []) {
      displayNames.push({
        locale,
        value: translation.get('clientName') ?? '',
      })
    }

    return displayNames
  }

  private defaultClientGrantTypes(client: Client) {
    switch (client.clientType) {
      case ClientType.web:
        return {
          clientId: client.clientId,
          grantType: 'authorization_code',
        }
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

  private clientInclude(): Includeable[] {
    return [
      { model: ClientClaim, as: 'claims' },
      { model: ClientGrantType, as: 'allowedGrantTypes' },
      { model: ClientRedirectUri, as: 'redirectUris' },
      { model: ClientPostLogoutRedirectUri, as: 'postLogoutRedirectUris' },
    ]
  }

  /**
   * Validates that the user has access to update the fields in the input.
   * If the user is a superuser, they can update all fields.
   * If the user is not a superuser, they can only update non-admin fields.
   */
  private validateUserUpdateAccess(user: User, input: AdminPatchClientDto) {
    const isSuperUser = user.scope.includes(AdminPortalScope.idsAdminSuperUser)

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
}
