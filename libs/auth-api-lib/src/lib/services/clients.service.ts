import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Client } from '../entities/models/client.model'
import { ClientAllowedScope } from '../entities/models/client-allowed-scope.model'
import { ClientAllowedCorsOrigin } from '../entities/models/client-allowed-cors-origin.model'
import { ClientRedirectUri } from '../entities/models/client-redirect-uri.model'
import { ClientIdpRestrictions } from '../entities/models/client-idp-restrictions.model'
import { ClientSecret } from '../entities/models/client-secret.model'
import { ClientPostLogoutRedirectUri } from '../entities/models/client-post-logout-redirect-uri.model'
import { ClientGrantType } from '../entities/models/client-grant-type.model'
import { ClientDTO } from '../entities/dto/client-dto'
import { ClientUpdateDTO } from '../entities/dto/client-update-dto'
import { ClientClaim } from '../entities/models/client-claim.model'

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client)
    private clientModel: typeof Client,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

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
}
