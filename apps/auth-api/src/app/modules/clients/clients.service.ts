import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Client } from './client.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Counter } from 'prom-client'
import { Sequelize } from 'sequelize-typescript'

@Injectable()
export class ClientsService {
  private clients: Client[];

  applicationsRegistered = new Counter({
    name: 'apps_auth-api-clients-service',
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
      where: { clientId }
    });

  }
}
