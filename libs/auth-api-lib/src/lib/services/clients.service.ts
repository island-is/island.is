import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { ClientDTO } from '../entities/dto/client.dto'
import { ClientUpdateDTO } from '../entities/dto/client-update.dto'
import { ClientIdpRestrictionDTO } from '../entities/dto/client-idp-restriction.dto'
import { ClientAllowedCorsOrigin } from '../entities/models/client-allowed-cors-origin.model'
import { ClientAllowedScope } from '../entities/models/client-allowed-scope.model'
import { ClientClaim } from '../entities/models/client-claim.model'
import { ClientGrantType } from '../entities/models/client-grant-type.model'
import { ClientIdpRestrictions } from '../entities/models/client-idp-restrictions.model'
import { ClientPostLogoutRedirectUri } from '../entities/models/client-post-logout-redirect-uri.model'
import { ClientRedirectUri } from '../entities/models/client-redirect-uri.model'
import { ClientSecret } from '../entities/models/client-secret.model'
import { Client } from '../entities/models/client.model'
import { ClientAllowedCorsOriginDTO } from '../entities/dto/client-allowed-cors-origin.dto'
import { ClientRedirectUriDTO } from '../entities/dto/client-redirect-uri.dto'

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client)
    private clientModel: typeof Client,
    @InjectModel(ClientAllowedCorsOrigin)
    private clientAllowedCorsOriginModel: typeof ClientAllowedCorsOrigin,
    @InjectModel(ClientIdpRestrictions)
    private clientIdpRestriction: typeof ClientIdpRestrictions,
    @InjectModel(ClientAllowedCorsOrigin)
    private clientAllowedCorsOrigin: typeof ClientAllowedCorsOrigin,
    @InjectModel(ClientRedirectUri)
    private clientRedirectUri: typeof ClientRedirectUri,
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
        ClientPostLogoutRedirectUri,
        ClientGrantType,
        ClientClaim,
      ],
    })
  }

  /** Gets all clients with paging */
  async findAndCountAll(
    page: number,
    count: number,
  ): Promise<{ rows: Client[]; count: number } | null> {
    page--
    const offset = page * count
    return this.clientModel.findAndCountAll({
      limit: count,
      offset: offset,
      include: [
        ClientAllowedScope,
        ClientAllowedCorsOrigin,
        ClientRedirectUri,
        ClientIdpRestrictions,
        ClientSecret,
        ClientPostLogoutRedirectUri,
        ClientPostLogoutRedirectUri,
        ClientGrantType,
        ClientClaim,
      ],
      distinct: true,
    })
  }

  /** Gets a client by it's id */
  async findClientById(id: string): Promise<Client | null> {
    this.logger.debug(`Finding client for id - "${id}"`)

    if (!id) {
      throw new BadRequestException('Id must be provided')
    }

    return this.clientModel.findByPk(id, {
      include: [
        ClientAllowedScope,
        ClientAllowedCorsOrigin,
        ClientRedirectUri,
        ClientIdpRestrictions,
        ClientSecret,
        ClientPostLogoutRedirectUri,
        ClientPostLogoutRedirectUri,
        ClientGrantType,
        ClientClaim,
      ],
    })
  }

  /** Creates a new client */
  async create(client: ClientDTO): Promise<Client> {
    this.logger.debug('Creating a new client')

    return await this.clientModel.create({ ...client })
  }

  /** Updates an existing client */
  async update(client: ClientUpdateDTO, id: string): Promise<Client | null> {
    this.logger.debug('Updating client with id: ', id)

    if (!id) {
      throw new BadRequestException('id must be provided')
    }

    await this.clientModel.update(
      { ...client },
      {
        where: { clientId: id },
      },
    )

    return await this.findClientById(id)
  }

  /** Deletes a client by id */
  async delete(id: string): Promise<number> {
    this.logger.debug('Deleting client with id: ', id)

    if (!id) {
      throw new BadRequestException('id must be provided')
    }

    return await this.clientModel.destroy({
      where: { clientId: id },
    })
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

    return this.clientAllowedCorsOriginModel.findAll({
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
        'IdpRestriction and clientId must be provided',
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
}
