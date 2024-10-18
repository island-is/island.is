/* eslint-disable  @typescript-eslint/no-explicit-any */
import type { Logger } from '@island.is/logging'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import Base64 from 'crypto-js/enc-base64'
import sha256 from 'crypto-js/sha256'
import { BulkCreateOptions, DestroyOptions } from 'sequelize'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { NoContentException } from '@island.is/nest/problem'
import { AuthDelegationType } from '@island.is/shared/types'

import { ClientsTranslationService } from './clients-translation.service'
import { ClientAllowedCorsOriginDTO } from './dto/client-allowed-cors-origin.dto'
import { ClientAllowedScopeDTO } from './dto/client-allowed-scope.dto'
import { ClientClaimDTO } from './dto/client-claim.dto'
import { ClientGrantTypeDTO } from './dto/client-grant-type.dto'
import { ClientIdpRestrictionDTO } from './dto/client-idp-restriction.dto'
import { ClientPostLogoutRedirectUriDTO } from './dto/client-post-logout-redirect-uri.dto'
import { ClientRedirectUriDTO } from './dto/client-redirect-uri.dto'
import { ClientSecretDTO } from './dto/client-secret.dto'
import { ClientUpdateDTO } from './dto/client-update.dto'
import { ClientDTO } from './dto/client.dto'
import { ClientAllowedCorsOrigin } from './models/client-allowed-cors-origin.model'
import { ClientAllowedScope } from './models/client-allowed-scope.model'
import { ClientClaim } from './models/client-claim.model'
import { ClientDelegationType } from './models/client-delegation-type.model'
import { ClientGrantType } from './models/client-grant-type.model'
import { ClientIdpRestrictions } from './models/client-idp-restrictions.model'
import { ClientPostLogoutRedirectUri } from './models/client-post-logout-redirect-uri.model'
import { ClientRedirectUri } from './models/client-redirect-uri.model'
import { ClientSecret } from './models/client-secret.model'
import { Client } from './models/client.model'

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client)
    private clientModel: typeof Client,
    @InjectModel(ClientAllowedCorsOrigin)
    private clientAllowedCorsOrigin: typeof ClientAllowedCorsOrigin,
    @InjectModel(ClientIdpRestrictions)
    private clientIdpRestriction: typeof ClientIdpRestrictions,
    @InjectModel(ClientSecret)
    private clientSecret: typeof ClientSecret,
    @InjectModel(ClientRedirectUri)
    private clientRedirectUri: typeof ClientRedirectUri,
    @InjectModel(ClientGrantType)
    private clientGrantType: typeof ClientGrantType,
    @InjectModel(ClientAllowedScope)
    private clientAllowedScope: typeof ClientAllowedScope,
    @InjectModel(ClientClaim)
    private clientClaim: typeof ClientClaim,
    @InjectModel(ClientDelegationType)
    private readonly clientDelegationType: typeof ClientDelegationType,
    @InjectModel(ClientPostLogoutRedirectUri)
    private clientPostLogoutUri: typeof ClientPostLogoutRedirectUri,
    private readonly clientsTranslationService: ClientsTranslationService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  /** Gets all clients */
  async findAll(): Promise<Client[] | null> {
    return this.clientModel.findAll({
      include: [
        ClientAllowedScope,
        ClientAllowedCorsOrigin,
        ClientRedirectUri,
        ClientIdpRestrictions,
        ClientSecret,
        ClientPostLogoutRedirectUri,
        ClientGrantType,
        ClientClaim,
        ClientDelegationType,
      ],
    })
  }

  async findAllWithTranslation(
    clientIds?: string[],
    lang?: string,
  ): Promise<Client[]> {
    const clients = await this.clientModel.findAll({
      where: {
        ...(clientIds && clientIds.length > 0 ? { clientId: clientIds } : {}),
      },
      attributes: ['clientId', 'clientName', 'domainName'],
    })

    if (lang) {
      return this.clientsTranslationService.translateClients(clients, lang)
    }

    return clients.sort((a, b) => a.clientId.localeCompare(b.clientId, 'is'))
  }

  /** Gets all clients with paging */
  async findAndCountAll(
    page: number,
    count: number,
    includeArchived: boolean,
  ): Promise<{ rows: Client[]; count: number }> {
    page--
    const offset = page * count
    return this.clientModel.findAndCountAll({
      limit: count,
      offset: offset,
      distinct: true,
      where: includeArchived ? {} : { archived: null },
      order: ['clientId'],
    })
  }

  /** Gets a client by its id */
  findClientById(id: string): Promise<Client | null> {
    this.logger.debug(`Finding client for id - "${id}"`)

    if (!id) {
      throw new BadRequestException('Id must be provided')
    }

    return this.clientModel.findByPk(id, {
      include: [
        { model: ClientAllowedScope, separate: true },
        { model: ClientAllowedCorsOrigin, separate: true },
        { model: ClientRedirectUri, separate: true },
        { model: ClientIdpRestrictions, separate: true },
        { model: ClientSecret, separate: true },
        { model: ClientPostLogoutRedirectUri, separate: true },
        { model: ClientGrantType, separate: true },
        { model: ClientClaim, separate: true },
        { model: ClientDelegationType, separate: true },
      ],
    })
  }

  /** Find clients by search string and returns with paging */
  async findClients(
    searchString: string,
    page: number,
    count: number,
    includeArchived: boolean,
  ) {
    if (!searchString) {
      throw new BadRequestException('Search String must be provided')
    }

    searchString = searchString.trim()

    if (isNaN(+searchString)) {
      return this.findAllClientsById(searchString, page, count, includeArchived)
    } else {
      return this.findAllClientsByNationalId(
        searchString,
        page,
        count,
        includeArchived,
      )
    }
  }

  /** Find clients by National Id */
  async findAllClientsByNationalId(
    searchString: string,
    page: number,
    count: number,
    includeArchived: boolean,
  ) {
    page--
    const offset = page * count
    return this.clientModel.findAndCountAll({
      limit: count,
      where: includeArchived
        ? { nationalId: searchString }
        : { nationalId: searchString, archived: null },
      order: ['clientId'],
      offset: offset,
      distinct: true,
    })
  }

  /** Finds client by client Id with paging return type */
  async findAllClientsById(
    searchString: string,
    page: number,
    count: number,
    includeArchived: boolean,
  ) {
    page--
    const offset = page * count
    return this.clientModel.findAndCountAll({
      limit: count,
      where: includeArchived
        ? { clientId: searchString }
        : { clientId: searchString, archived: null },
      order: ['clientId'],
      offset: offset,
      distinct: true,
    })
  }

  /** Creates a new client */
  async create(client: ClientDTO): Promise<Client> {
    this.logger.debug('Creating a new client')

    return await this.clientModel.create({ ...client })
  }

  /** Updates an existing client */
  async update(clientData: ClientUpdateDTO, id: string): Promise<Client> {
    this.logger.debug('Updating client with id: ', id)

    if (!id) {
      throw new BadRequestException('id must be provided')
    }

    const client = await this.findClientById(id)
    if (!client) {
      throw new NoContentException()
    }

    const [_, clients] = await this.clientModel.update(clientData, {
      where: { clientId: id },
      returning: true,
    })

    return clients[0]
  }

  /** Soft delete on a client by id */
  async delete(id: string): Promise<number> {
    this.logger.debug('Soft deleting a client with id: ', id)

    if (!id) {
      throw new BadRequestException('id must be provided')
    }

    const result = await this.clientModel.update(
      { archived: new Date(), enabled: false },
      {
        where: { clientId: id },
      },
    )

    return result[0]
  }

  /** Finds allowed cors origins by origin */
  async findAllowedCorsOrigins(
    origin: string,
  ): Promise<ClientAllowedCorsOrigin[]> {
    this.logger.debug(
      `Finding client allowed CORS origins for origin - "${origin}"`,
    )

    if (!origin) {
      throw new BadRequestException('Origin must be provided')
    }

    return this.clientAllowedCorsOrigin.findAll({
      where: { origin: origin },
    })
  }

  /** Adds IDP restriction to client */
  async addIdpRestriction(
    clientIdpRestriction: ClientIdpRestrictionDTO,
  ): Promise<ClientIdpRestrictions> {
    this.logger.debug(
      `Creating IDP restriction for client - "${clientIdpRestriction.clientId}" with restriction - "${clientIdpRestriction.name}"`,
    )

    if (!clientIdpRestriction) {
      throw new BadRequestException('ClientIdpRestriction must be provided')
    }

    return await this.clientIdpRestriction.create({ ...clientIdpRestriction })
  }

  /** Removes an IDP restriction for a client */
  async removeIdpRestriction(clientId: string, name: string): Promise<number> {
    this.logger.debug(
      `Removing IDP restriction for client - "${clientId}" with restriction - "${name}"`,
    )

    if (!name || !clientId) {
      throw new BadRequestException(
        'IdpRestriction name and clientId must be provided',
      )
    }

    return await this.clientIdpRestriction.destroy({
      where: { clientId: clientId, name: name },
    })
  }

  /** Adds Allowed CORS origin for client */
  async addAllowedCorsOrigin(
    corsOrigin: ClientAllowedCorsOriginDTO,
  ): Promise<ClientAllowedCorsOrigin> {
    this.logger.debug(
      `Adding allowed cors origin for client - "${corsOrigin.clientId}" with origin - "${corsOrigin.origin}"`,
    )

    if (!corsOrigin) {
      throw new BadRequestException('Cors origin object must be provided')
    }

    return await this.clientAllowedCorsOrigin.create({ ...corsOrigin })
  }

  /** Removes an allowed cors origin for client */
  async removeAllowedCorsOrigin(
    clientId: string,
    origin: string,
  ): Promise<number> {
    this.logger.debug(
      `Removing cors origin for client - "${clientId}" with origin - "${origin}"`,
    )

    if (!clientId || !origin) {
      throw new BadRequestException('origin and clientId must be provided')
    }

    return await this.clientAllowedCorsOrigin.destroy({
      where: { clientId: clientId, origin: origin },
    })
  }

  /** Adds an redirect uri for client */
  async addRedirectUri(
    redirectObject: ClientRedirectUriDTO,
  ): Promise<ClientRedirectUri> {
    this.logger.debug(
      `Adding redirect uri for client - "${redirectObject.clientId}" with uri - "${redirectObject.redirectUri}"`,
    )

    if (!redirectObject) {
      throw new BadRequestException('Redirect object must be provided')
    }

    return await this.clientRedirectUri.create({ ...redirectObject })
  }

  /** Removes an redirect uri for client */
  async removeRedirectUri(
    clientId: string,
    redirectUri: string,
  ): Promise<number> {
    this.logger.debug(
      `Removing redirect uri for client - "${clientId}" with uri - "${redirectUri}"`,
    )

    if (!clientId || !redirectUri) {
      throw new BadRequestException('redirectUri and clientId must be provided')
    }

    return await this.clientRedirectUri.destroy({
      where: { clientId: clientId, redirectUri: redirectUri },
    })
  }

  /** Adds a grant type to client */
  async addGrantType(
    grantTypeObj: ClientGrantTypeDTO,
  ): Promise<ClientGrantType> {
    this.logger.debug(
      `Adding grant type - "${grantTypeObj.grantType}" to client - "${grantTypeObj.clientId}"`,
    )

    if (!grantTypeObj) {
      throw new BadRequestException('Grant Type object must be provided')
    }

    return await this.clientGrantType.create({ ...grantTypeObj })
  }

  /** Removes a grant type for client */
  async removeGrantType(clientId: string, grantType: string): Promise<number> {
    this.logger.debug(
      `Removing grant type "${grantType}" for client - "${clientId}"`,
    )

    if (!clientId || !grantType) {
      throw new BadRequestException('grantType and clientId must be provided')
    }

    return await this.clientGrantType.destroy({
      where: { clientId: clientId, grantType: grantType },
    })
  }

  /** Adds an allowed scope to client */
  async addAllowedScope(
    clientAllowedScope: ClientAllowedScopeDTO,
  ): Promise<ClientAllowedScope> {
    this.logger.debug(
      `Adding allowed scope - "${clientAllowedScope.scopeName}" to client - "${clientAllowedScope.clientId}"`,
    )

    if (!clientAllowedScope) {
      throw new BadRequestException(
        'clientAllowedScope object must be provided',
      )
    }

    return await this.clientAllowedScope.create({ ...clientAllowedScope })
  }

  /**
   * Adds multiple allowed scopes to client
   * @param scopeNames - Unique scope names
   * @param clientId - Client ID
   * @param options - Bulk create options
   */
  async addAllowedScopes(
    scopeNames: string[],
    clientId: string,
    options: BulkCreateOptions = {},
  ): Promise<ClientAllowedScope[]> {
    this.logger.debug(
      `Adding allowed scopes - [${scopeNames
        .map((scopeName) => scopeName)
        .join(', ')}] to client - "${clientId}"`,
    )

    return this.clientAllowedScope.bulkCreate(
      scopeNames.map((scopeName) => ({
        clientId,
        scopeName,
      })),
      options,
    )
  }

  /** Removes an allowed scope from client */
  async removeAllowedScope(
    clientId: string,
    scopeName: string,
  ): Promise<number> {
    this.logger.debug(
      `Removing scope - "${scopeName}" from client - "${clientId}"`,
    )

    if (!clientId || !scopeName) {
      throw new BadRequestException('scopeName and clientId must be provided')
    }

    return this.clientAllowedScope.destroy({
      where: {
        clientId: clientId,
        scopeName: scopeName,
      },
    })
  }

  /**
   * Removes multiple allowed scopes from client
   * @param scopeNames - Unique scope names
   * @param clientId - Client ID
   * @param options - Destroy options
   */
  async removeAllowedScopes(
    scopeNames: string[],
    clientId: string,
    options: DestroyOptions = {},
  ): Promise<number> {
    this.logger.debug(
      `Removing scopes - [${scopeNames
        .map((scopeName) => scopeName)
        .join(', ')}] from client - "${clientId}"`,
    )

    return this.clientAllowedScope.destroy({
      where: {
        clientId: clientId,
        scopeName: scopeNames,
      },
      ...options,
    })
  }

  /** Adds an claim to client */
  async addClaim(claim: ClientClaimDTO): Promise<ClientClaim> {
    this.logger.debug(
      `Adding claim of type - "${claim.type}", with value - "${claim.value}" to client - "${claim.clientId}"`,
    )

    if (!claim) {
      throw new BadRequestException('claim object must be provided')
    }

    return await this.clientClaim.create({ ...claim })
  }

  /** Removes a claim from client */
  async removeClaim(
    clientId: string,
    claimType: string,
    claimValue: string,
  ): Promise<number> {
    this.logger.debug(
      `Removing claim of type - "${claimType}", with value - "${claimValue}" from client - "${clientId}"`,
    )

    if (!clientId || !claimType || !claimValue) {
      throw new BadRequestException(
        'claimType, claimValue and clientId must be provided',
      )
    }

    return await this.clientClaim.destroy({
      where: { clientId: clientId, type: claimType, value: claimValue },
    })
  }

  /** Adds an post logout uri to client */
  async addPostLogoutRedirectUri(
    postLogoutUri: ClientPostLogoutRedirectUriDTO,
  ): Promise<ClientPostLogoutRedirectUri> {
    this.logger.debug(
      `Adding post logout uri - "${postLogoutUri.redirectUri}", to client - "${postLogoutUri.clientId}"`,
    )

    if (!postLogoutUri) {
      throw new BadRequestException('postLogoutUri object must be provided')
    }

    return await this.clientPostLogoutUri.create({ ...postLogoutUri })
  }

  /** Removes an post logout uri from client */
  async removePostLogoutRedirectUri(
    clientId: string,
    redirectUri: string,
  ): Promise<number> {
    this.logger.debug(
      `Removing post logout uri - "${redirectUri}" from client - "${clientId}"`,
    )

    if (!clientId || !redirectUri) {
      throw new BadRequestException('clientId and uri must be provided')
    }

    return await this.clientPostLogoutUri.destroy({
      where: { clientId: clientId, redirectUri: redirectUri },
    })
  }

  /** Add secret to Client */
  async addClientSecret(clientSecret: ClientSecretDTO): Promise<ClientSecret> {
    const words = sha256(clientSecret.value)
    const secret = Base64.stringify(words)

    return this.clientSecret.create({
      clientId: clientSecret.clientId,
      value: secret,
      description: clientSecret.description,
      type: clientSecret.type,
    })
  }

  /** Remove a secret from Client */
  async removeClientSecret(clientSecret: ClientSecretDTO): Promise<number> {
    return this.clientSecret.destroy({
      where: {
        clientId: clientSecret.clientId,
        value: clientSecret.value,
      },
    })
  }

  /* Add supported delegation types to client */
  async addClientDelegationTypes({
    clientId,
    delegationTypes = [],
    options = {},
  }: {
    clientId: string
    delegationTypes?: string[]
    options: BulkCreateOptions
  }) {
    const supportsCustomDelegation = delegationTypes.includes(
      AuthDelegationType.Custom,
    )
    const supportsProcuringHolders = delegationTypes.includes(
      AuthDelegationType.ProcurationHolder,
    )

    const supportsLegalGuardians = delegationTypes.includes(
      AuthDelegationType.LegalGuardian,
    )

    const supportsPersonalRepresentatives = delegationTypes.some((type) =>
      type.startsWith(AuthDelegationType.PersonalRepresentative),
    )

    if (
      supportsCustomDelegation ||
      supportsLegalGuardians ||
      supportsProcuringHolders ||
      supportsPersonalRepresentatives
    ) {
      await this.clientModel.update(
        {
          ...(supportsLegalGuardians ? { supportsLegalGuardians } : {}),
          ...(supportsPersonalRepresentatives
            ? { supportsPersonalRepresentatives }
            : {}),
          ...(supportsProcuringHolders ? { supportsProcuringHolders } : {}),
          ...(supportsCustomDelegation ? { supportsCustomDelegation } : {}),
        },
        {
          ...options,
          where: {
            clientId,
          },
        },
      )
    }

    if (supportsCustomDelegation) {
      delegationTypes.push(AuthDelegationType.GeneralMandate)
    }

    return Promise.all(
      delegationTypes.map((delegationType) =>
        this.clientDelegationType.upsert(
          {
            clientId,
            delegationType,
          },
          options,
        ),
      ),
    )
  }

  /* Remove supported delegation types from client */
  async removeClientDelegationTypes({
    clientId,
    delegationTypes = [],
    options = {},
  }: {
    clientId: string
    delegationTypes?: string[]
    options: DestroyOptions
  }) {
    const supportsCustomDelegation = delegationTypes.includes(
      AuthDelegationType.Custom,
    )
      ? false
      : undefined
    const supportsProcuringHolders = delegationTypes.includes(
      AuthDelegationType.ProcurationHolder,
    )
      ? false
      : undefined
    const supportsLegalGuardians = delegationTypes.includes(
      AuthDelegationType.LegalGuardian,
    )
      ? false
      : undefined
    const supportsPersonalRepresentatives = delegationTypes.some((type) =>
      type.startsWith(AuthDelegationType.PersonalRepresentative),
    )
      ? false
      : undefined

    // Update boolean fields in client table
    if (
      supportsCustomDelegation === false ||
      supportsLegalGuardians === false ||
      supportsProcuringHolders === false ||
      supportsPersonalRepresentatives === false
    ) {
      await this.clientModel.update(
        {
          supportsCustomDelegation,
          supportsLegalGuardians,
          supportsProcuringHolders,
          supportsPersonalRepresentatives,
        },
        {
          ...options,
          where: {
            clientId,
          },
        },
      )
    }

    if (delegationTypes.includes(AuthDelegationType.Custom)) {
      delegationTypes.push(AuthDelegationType.GeneralMandate)
    }

    return Promise.all(
      delegationTypes.map((delegationType) =>
        this.clientDelegationType.destroy({
          ...options,
          where: {
            clientId,
            delegationType,
          },
        }),
      ),
    )
  }
}
