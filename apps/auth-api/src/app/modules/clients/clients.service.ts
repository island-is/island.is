import { ClientDTO } from './dto/client-dto';
import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
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

  async findClientById(clientId: string): Promise<Client> {
    this.logger.debug(`Finding client for clientId - "${clientId}"`)
    return this.clientModel.findOne({
      where: { clientId },
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

  async createAsync(client: ClientDTO): Promise<Client> {
    this.logger.debug('Creating a new client')

    return await this.clientModel.create(
      { ...client }
    )
  }
}
