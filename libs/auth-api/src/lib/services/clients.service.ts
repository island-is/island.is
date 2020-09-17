import {
  Inject,
  Injectable,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Counter } from 'prom-client'
import { Sequelize } from 'sequelize-typescript'
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
  private clients: Client[]

  applicationsRegistered = new Counter({
    name: 'apps_registered6',
    labelNames: ['res1'],
    help: 'Number of applications',
  })

  constructor(
    private sequelize: Sequelize,
    @InjectModel(Client)
    private clientModel: typeof Client,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findClientById(id: string): Promise<Client> {
    this.logger.debug(`Finding client for id - "${id}"`)
    return this.clientModel.findOne({
      where: { clientId: id },
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

  async create(client: ClientDTO): Promise<Client> {
    this.logger.debug('Creating a new client')

    return await this.clientModel.create(
      { ...client }
    )
  }

  async update(client: ClientUpdateDTO, id: string): Promise<Client> {
    this.logger.debug('Updating client with id: ', id)

    await this.clientModel.update(
      { ...client },
      {
        where: { clientId: id}
      }
    )

    return await this.findClientById(id)
  }

  async delete(id: string): Promise<number> {
    this.logger.debug('Deleting client with id: ', id)

    return await this.clientModel.destroy({
      where: { clientId: id }
    })
  }
}
