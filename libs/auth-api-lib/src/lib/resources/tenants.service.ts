import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { User } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { NoContentException } from '@island.is/nest/problem'

import { Client } from '../clients/models/client.model'
import { AdminCreateTenantDto } from './dto/admin-create-tenant.dto'
import { AdminPatchTenantDto } from './dto/admin-patch-tenant.dto'
import { TenantDto } from './dto/tenant.dto'
import { ApiScopeGroup } from './models/api-scope-group.model'
import { ApiScope } from './models/api-scope.model'
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
    @InjectModel(Client)
    private readonly clientModel: typeof Client,
    @InjectModel(ApiScope)
    private readonly apiScopeModel: typeof ApiScope,
    @InjectModel(ApiScopeGroup)
    private readonly apiScopeGroupModel: typeof ApiScopeGroup,
  ) {}

  async findAllByUser(user: User): Promise<TenantDto[]> {
    const isSuperUser = user.scope.includes(AdminPortalScope.idsAdminSuperUser)

    const tenants = await this.domainModel.findAll({
      ...(!isSuperUser && {
        where: {
          nationalId: user.nationalId,
        },
      }),
      attributes: ['name', 'displayName', 'nationalId'],
    })

    return tenants
      .sort((a, b) => a.name.localeCompare(b.name, 'is'))
      .map((tenant) => ({
        name: tenant.name,
        displayName: [{ locale: 'is', value: tenant.displayName }],
        nationalId: tenant.nationalId,
      }))
  }

  async findById(id: string): Promise<TenantDto> {
    const tenant = await this.domainModel.findOne({
      where: { name: id },
      attributes: ['name', 'displayName', 'contactEmail'],
    })

    if (!tenant) {
      throw new NoContentException()
    }

    return {
      name: tenant.name,
      displayName: [{ locale: 'is', value: tenant.displayName }],
      contactEmail: tenant.contactEmail,
    }
  }

  /**
   * Full domain row used by the admin edit screen. Includes fields that the
   * public `findById` intentionally does not return.
   */
  async findByIdForAdmin(id: string): Promise<Domain> {
    const tenant = await this.domainModel.findOne({
      where: { name: id },
    })

    if (!tenant) {
      throw new NoContentException()
    }

    return tenant
  }

  async hasAccessToTenant(user: User, tenantId: string) {
    const isSuperUser = user.scope.includes(AdminPortalScope.idsAdminSuperUser)

    const tenant = await this.domainModel.findOne({
      where: {
        name: tenantId,
        ...(isSuperUser ? {} : { nationalId: user.nationalId }),
      },
      attributes: ['name'],
    })
    return Boolean(tenant)
  }

  async create(dto: AdminCreateTenantDto): Promise<Domain> {
    const existing = await this.domainModel.findOne({
      where: { name: dto.name },
      attributes: ['name'],
    })

    if (existing) {
      throw new ConflictException(`Tenant "${dto.name}" already exists`)
    }

    return this.domainModel.create({ ...dto })
  }

  async update(name: string, dto: AdminPatchTenantDto): Promise<Domain> {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('No fields provided to update')
    }

    const existing = await this.domainModel.findOne({ where: { name } })

    if (!existing) {
      throw new NoContentException()
    }

    return existing.update({ ...dto })
  }

  async delete(name: string): Promise<void> {
    const existing = await this.domainModel.findOne({
      where: { name },
      attributes: ['name'],
    })

    if (!existing) {
      throw new NoContentException()
    }

    const [clientCount, scopeCount, scopeGroupCount] = await Promise.all([
      this.clientModel.count({ where: { domainName: name } }),
      this.apiScopeModel.count({ where: { domainName: name } }),
      this.apiScopeGroupModel.count({ where: { domainName: name } }),
    ])

    if (clientCount + scopeCount + scopeGroupCount > 0) {
      throw new BadRequestException(
        `Cannot delete tenant "${name}": it still has ${clientCount} client(s), ${scopeCount} scope(s) and ${scopeGroupCount} scope group(s) referencing it.`,
      )
    }

    await this.domainModel.destroy({ where: { name } })
  }
}
