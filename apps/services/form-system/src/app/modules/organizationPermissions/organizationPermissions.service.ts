import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { OrganizationPermission } from './models/organizationPermission.model'
import { UpdateOrganizationPermissionDto } from './models/dto/updateOrganizationPermission.dto'
import { OrganizationPermissionDto } from './models/dto/organizationPermission.dto'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'
import { Organization } from '../organizations/models/organization.model'

@Injectable()
export class OrganizationPermissionsService {
  constructor(
    @InjectModel(Organization)
    private readonly organizationModel: typeof Organization,
    @InjectModel(OrganizationPermission)
    private readonly organizationPermissionModel: typeof OrganizationPermission,
  ) {}

  async create(
    createOrganizationPermissionDto: UpdateOrganizationPermissionDto,
  ): Promise<OrganizationPermissionDto> {
    const organization = await this.organizationModel.findOne({
      where: {
        nationalId: createOrganizationPermissionDto.organizationNationalId,
      },
    })

    if (!organization) {
      throw new NotFoundException(
        `Organization with nationalId '${createOrganizationPermissionDto.organizationNationalId}' not found`,
      )
    }

    const organizationPermission = new OrganizationPermission()
    organizationPermission.organizationId = organization.id
    organizationPermission.permission =
      createOrganizationPermissionDto.permission

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
    const organization = await this.organizationModel.findOne({
      where: {
        nationalId: deleteOrganizationPermissionDto.organizationNationalId,
      },
    })

    if (!organization) {
      throw new NotFoundException(
        `Organization with nationalId '${deleteOrganizationPermissionDto.organizationNationalId}' not found`,
      )
    }

    const organizationPermission =
      await this.organizationPermissionModel.findOne({
        where: {
          organizationId: organization.id,
          permission: deleteOrganizationPermissionDto.permission,
        },
      })

    if (!organizationPermission) {
      {
        throw new NotFoundException(
          `Organization permission with 
        organizationId '${organization.id}' and
        permission '${deleteOrganizationPermissionDto.permission}' not found`,
        )
      }
    }
    organizationPermission.destroy()
  }
}
