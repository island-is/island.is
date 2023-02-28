import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { User } from '@island.is/auth-nest-tools'

import { TenantDto } from './dto/tenant.dto'
import { Domain } from './models/domain.model'

/**
 * This is a service that is used to access the tenants resource.
 * (Previously known as domains).
 */
@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Domain)
    private readonly domainModel: typeof Domain,
  ) {}

  async findAllByOwner(user: User): Promise<TenantDto[]> {
    const tenants = await this.domainModel.findAll({
      where: {
        nationalId: user.nationalId,
      },
      attributes: ['name', 'displayName'],
    })

    return tenants.map((tenant) => ({
      name: tenant.name,
      displayName: [{ locale: 'is', value: tenant.displayName }],
    }))
  }
}
