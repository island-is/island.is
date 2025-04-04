import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { OrganizationPermission } from './models/organizationPermission.model'
import { UpdateOrganizationPermissionDto } from './models/dto/updateOrganizationPermission.dto'
import { OrganizationPermissionDto } from './models/dto/organizationPermission.dto'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'

@Injectable()
export class OrganizationPermissionsService {
  constructor(
    @InjectModel(OrganizationPermission)
    private readonly organizationPermissionModel: typeof OrganizationPermission,
  ) {}

  async create(
    createOrganizationPermissionDto: UpdateOrganizationPermissionDto,
  ): Promise<OrganizationPermissionDto> {
    const organizationPermission =
      createOrganizationPermissionDto as OrganizationPermission

    const newOrganizationPermission: OrganizationPermission =
      new this.organizationPermissionModel(organizationPermission)

    await newOrganizationPermission.save()

    const keys = ['permission']
    const organizationPermissionDto: OrganizationPermissionDto = defaults(
      pick(newOrganizationPermission, keys),
      zipObject(keys, Array(keys.length).fill(null)),
    ) as OrganizationPermissionDto

    return organizationPermissionDto
  }

  async delete(
    deleteOrganizationPermissionDto: UpdateOrganizationPermissionDto,
  ): Promise<void> {
    const organizationPermission =
      await this.organizationPermissionModel.findOne({
        where: {
          organizationId: deleteOrganizationPermissionDto.organizationId,
          permission: deleteOrganizationPermissionDto.permission,
        },
      })

    if (!organizationPermission) {
      {
        throw new NotFoundException(
          `Organization permission with 
        organizationId '${deleteOrganizationPermissionDto.organizationId}' and
        permission '${deleteOrganizationPermissionDto.permission}' not found`,
        )
      }
    }
    organizationPermission.destroy()
  }
}
