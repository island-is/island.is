import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { and, Includeable, Op } from 'sequelize'

import { User } from '@island.is/auth-nest-tools'
import { NoContentException } from '@island.is/nest/problem'

import { Domain } from '../../resources/models/domain.model'
import { TranslationService } from '../../translation/translation.service'
import { ClientType, GrantTypeEnum } from '../../types'
import { Client } from '../models/client.model'
import { ClientClaim } from '../models/client-claim.model'
import { ClientGrantType } from '../models/client-grant-type.model'
import { ClientRedirectUri } from '../models/client-redirect-uri.model'
import { ClientPostLogoutRedirectUri } from '../models/client-post-logout-redirect-uri.model'
import { AdminClientDto } from './dto/admin-client.dto'
import { AdminCreateClientDto } from './dto/admin-create-client.dto'

export const clientBaseAttributes: Partial<Client> = {
  absoluteRefreshTokenLifetime: 8 * 60 * 60, // 8 hours
  accessTokenLifetime: 5 * 60, // 5 minutes
  allowOfflineAccess: true,
  allowRememberConsent: true,
  alwaysIncludeUserClaimsInIdToken: true,
  alwaysSendClientClaims: true,
  identityTokenLifetime: 5 * 60, // 5 minutes
  refreshTokenExpiration: 1, // ToDo when #10673 is merged use RefreshTokenExpiration.Absolute
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
    @InjectModel(ClientGrantType)
    private readonly clientGrantType: typeof ClientGrantType,
    private readonly translationService: TranslationService,
  ) {}

  async findByTenantId(tenantId: string): Promise<AdminClientDto[]> {
    const clients = await this.clientModel.findAll({
      where: {
        clientId: {
          [Op.startsWith]: tenantId,
        },
      },
      include: this.clientInclude(),
    })

    const clientTranslations = await this.translationService.findTranslationMap(
      'client',
      clients.map((client) => client.clientId),
      'en',
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
      where: and(
        {
          clientId,
        },
        {
          clientId: { [Op.startsWith]: tenantId },
        },
      ),
      include: this.clientInclude(),
    })
    if (!client) {
      throw new NoContentException()
    }

    const clientTranslation = await this.translationService.findTranslationMap(
      'client',
      [client.clientId],
      'en',
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
    translations?: Map<string, string>,
  ): AdminClientDto {
    const enDisplayName = translations?.get('clientName')

    return {
      clientId: client.clientId,
      clientType: client.clientType,
      tenantId: client.domainName ?? '',
      displayName: client.clientName
        ? [
            { locale: 'is', value: client.clientName },
            ...(enDisplayName
              ? [
                  {
                    locale: 'en',
                    value: enDisplayName,
                  },
                ]
              : []),
          ]
        : [],
      absoluteRefreshTokenLifetime: client.absoluteRefreshTokenLifetime,
      slidingRefreshTokenLifetime: client.slidingRefreshTokenLifetime,
      refreshTokenExpiration: client.refreshTokenExpiration,
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
        client.claims?.reduce(
          (acc, curr) => ({ ...acc, [curr.type]: curr.value }),
          {},
        ) ?? {},
    }
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
}
