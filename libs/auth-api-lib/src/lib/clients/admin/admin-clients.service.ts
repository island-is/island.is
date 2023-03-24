import { NoContentException } from '@island.is/nest/problem'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { and, Op } from 'sequelize'

import { Client } from '../models/client.model'
import { AdminClientType } from './dto/admin-client-type.enum'
import { AdminClientDto } from './dto/admin-client.dto'
import { AdminCreateClientDto } from './dto/admin-create-client.dto'
import { User } from '@island.is/auth-nest-tools'
import { Domain } from '../../resources/models/domain.model'

@Injectable()
export class AdminClientsService {
  constructor(
    @InjectModel(Client)
    private clientModel: typeof Client,
    @InjectModel(Domain)
    private readonly domainModel: typeof Domain,
  ) {}

  async findByTenantId(tenantId: string): Promise<AdminClientDto[]> {
    const clients = await this.clientModel.findAll({
      where: {
        clientId: {
          [Op.startsWith]: tenantId,
        },
      },
    })
    return clients.map((client) => this.formatClient(client))
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
    })
    if (!client) {
      throw new NoContentException()
    }
    return this.formatClient(client)
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
      nationalId: tenant.nationalId,
      clientName: clientDto.clientName,
      ...this.defaultClientAttributes(clientDto.clientType),
    })
    return this.formatClient(client)
  }

  defaultClientAttributes(clientType: AdminClientType) {
    switch (clientType) {
      default:
        return {}
    }
  }

  formatClient(client: Client): AdminClientDto {
    return {
      clientId: client.clientId,
      clientType: client.clientType,
    }
  }
}
