import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Client } from './client.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Counter } from 'prom-client'
import { Sequelize } from 'sequelize-typescript'
import { ClientAllowedScope } from './client-allowed-scope.model'
import { ClientAllowedCorsOrigin } from './client-allowed-cors-origin.model'
import { ClientRedirectUri } from './client-redirect-uri.model'
import { ClientIdpRestrictions } from './client-idp-restrictions.model'
import { ClientSecret } from './client-secret.model'
import { ClientPostLogoutRedirectUri } from './client-post-logout-redirect-uri.model'

@Injectable()
export class ClientsService {
  private clients: Client[];

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
  ) {
  }

  async findClientById(clientId: string): Promise<Client> {
    this.logger.debug(`Finding client for clientId - "${clientId}"`)
    return this.clientModel.findOne({
      where: { clientId },
      include: [ ClientAllowedScope, ClientAllowedCorsOrigin, ClientRedirectUri, ClientIdpRestrictions, ClientSecret, ClientPostLogoutRedirectUri, ClientPostLogoutRedirectUri ]
    });

  }
}
