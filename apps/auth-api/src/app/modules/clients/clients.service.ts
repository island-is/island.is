import { ClientDTO } from './dto/client-dto';
import {
  Inject,
  Injectable,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Client } from './models/client.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Counter } from 'prom-client'
import { Sequelize } from 'sequelize-typescript'
import { ClientAllowedScope } from './models/client-allowed-scope.model'
import { ClientAllowedCorsOrigin } from './models/client-allowed-cors-origin.model'
import { ClientRedirectUri } from './models/client-redirect-uri.model'
import { ClientIdpRestrictions } from './models/client-idp-restrictions.model'
import { ClientSecret } from './models/client-secret.model'
import { ClientPostLogoutRedirectUri } from './models/client-post-logout-redirect-uri.model'
import { ClientGrantType } from './models/client-grant-type.model'
import { ClientUpdateDTO } from './dto/client-update-dto';

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
<<<<<<< HEAD
      where: { clientId },
      include: [ ClientAllowedScope, ClientAllowedCorsOrigin, ClientRedirectUri, ClientIdpRestrictions, ClientSecret, ClientPostLogoutRedirectUri, ClientPostLogoutRedirectUri, ClientGrantType ]
    });
=======
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
>>>>>>> f7e1e8d6357d8c2706c9ee3ce6d190beeb4520fe

    return await this.clientModel.destroy({
      where: { clientId: id }
    })
  }
}
