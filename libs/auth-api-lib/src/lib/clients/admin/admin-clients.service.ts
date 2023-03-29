import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { and, Op } from 'sequelize'

import { User } from '@island.is/auth-nest-tools'
import { NoContentException } from '@island.is/nest/problem'

import { Domain } from '../../resources/models/domain.model'
import { Client } from '../models/client.model'
import { ClientGrantType } from '../models/client-grant-type.model'
import { AdminClientType } from './dto/admin-client-type.enum'
import { AdminClientDto } from './dto/admin-client.dto'
import { AdminCreateClientDto } from './dto/admin-create-client.dto'

export const clientBaseAttributes: Partial<Client> = {
  absoluteRefreshTokenLifetime: 8 * 60 * 60, // 8 hours
  accessTokenLifetime: 5 * 60, // 5 minutes
  allowOfflineAccess: true,
  allowRememberConsent: true,
  alwaysIncludeUserClaimsInIdToken: true,
  alwaysSendClientClaims: true,
  identityTokenLifetime: 5 * 60, // 5 minutes
  refreshTokenExpiration: 1, // ToDo when #10673 is merged use RefreshTokenExpiration.Absolute
  refreshTokenUsage: 1, // Single usage
  requireClientSecret: true,
  requirePkce: true,
  slidingRefreshTokenLifetime: 20 * 60, // 20 minutes
  updateAccessTokenClaimsOnRefresh: true,
}

@Injectable()
export class AdminClientsService {
  constructor(
    @InjectModel(Client)
    private clientModel: typeof Client,
    @InjectModel(Domain)
    private readonly domainModel: typeof Domain,
    @InjectModel(ClientGrantType)
    private readonly clientGrantType: typeof ClientGrantType,
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

    await this.clientGrantType.create(this.defaultClientGrantTypes(client))

    return this.formatClient(client)
  }

  private defaultClientAttributes(clientType: AdminClientType) {
    switch (clientType) {
      case AdminClientType.web:
        return clientBaseAttributes
      case AdminClientType.native:
        return {
          ...clientBaseAttributes,
          absoluteRefreshTokenLifetime: 365 * 24 * 60 * 60, // 1 year
          requireClientSecret: false,
          slidingRefreshTokenLifetime: 90 * 24 * 60 * 60, // 3 months
        }
      case AdminClientType.machine:
        return {
          ...clientBaseAttributes,
          allowOfflineAccess: false,
          requirePkce: false,
        }
      default:
        throw new Error(`Unknown client type: ${clientType}`)
    }
  }

  private formatClient(client: Client): AdminClientDto {
    return {
      clientId: client.clientId,
      clientType: client.clientType,
    }
  }

  private defaultClientGrantTypes(client: Client) {
    switch (client.clientType) {
      case AdminClientType.web:
        return {
          clientId: client.clientId,
          grantType: 'authorization_code',
        }
      case AdminClientType.native:
        return {
          clientId: client.clientId,
          grantType: 'authorization_code',
        }
      case AdminClientType.machine:
        return {
          clientId: client.clientId,
          grantType: 'client_credentials',
        }
    }
  }
}
