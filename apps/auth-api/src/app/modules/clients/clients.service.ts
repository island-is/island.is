import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Client } from './client.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { Counter } from 'prom-client'
import { Sequelize } from 'sequelize-typescript'

@Injectable()
export class ClientsService {
  applicationsRegistered = new Counter({
    name: 'apps_registered2',
    labelNames: ['res1'],
    help: 'Number of applications',
  }) // TODO: How does this work?

  constructor(
    private sequelize: Sequelize,
    @InjectModel(Client)
    private clientModel: typeof Client,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findClientById(clientId: string): Promise<Client> {
    this.logger.debug(`Finding client for clientId - "${clientId}"`)
    return { ClientId: "testing works" } as Client;
  }
}
