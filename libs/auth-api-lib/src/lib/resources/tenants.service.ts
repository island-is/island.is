import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { User } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'

import { TenantDto } from './dto/tenant.dto'
import { Domain } from './models/domain.model'
import { NoContentException } from '@island.is/nest/problem'

/**
 * This is a service that is used to access the tenant resource.
 * (Previously known as domains).
 */
@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Domain)
    private readonly domainModel: typeof Domain,
  ) {}

  async findAll(user: User): Promise<TenantDto[]> {
    const isSuperUser = user.scope.includes(AdminPortalScope.idsAdminSuperUser)

    const tenants = await this.domainModel.findAll({
      where: {
        ...(isSuperUser ? {} : { nationalId: user.nationalId }),
      },
      attributes: ['name', 'displayName'],
    })

    return tenants.map((tenant) => ({
      name: tenant.name,
      displayName: [{ locale: 'is', value: tenant.displayName }],
    }))
  }

  async findById(user: User, id: string): Promise<TenantDto> {
    const isSuperUser = user.scope.includes(AdminPortalScope.idsAdminSuperUser)

    const tenant = await this.domainModel.findOne({
      where: {
        name: id,
        ...(isSuperUser ? {} : { nationalId: user.nationalId }),
      },
      attributes: ['name', 'displayName'],
    })

    if (!tenant) {
      throw new NoContentException()
    }

    return {
      name: tenant.name,
      displayName: [{ locale: 'is', value: tenant.displayName }],
    }
  }
}
