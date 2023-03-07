import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { User } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'

import { TenantDto } from './dto/tenant.dto'
import { Domain } from './models/domain.model'

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
      ...(!isSuperUser && {
        where: {
          nationalId: user.nationalId,
        },
      }),
      attributes: ['name', 'displayName'],
    })

    return tenants.map((tenant) => ({
      name: tenant.name,
      displayName: [{ locale: 'is', value: tenant.displayName }],
    }))
  }
}
