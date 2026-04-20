import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Organization } from './models/organization.model'
import { OrganizationAdminDto } from './models/dto/organizationAdmin.dto'
import { CertificationTypes } from '../../dataTypes/certificationTypes/certificationType.model'
import { Option } from '../../dataTypes/option.model'
import { User } from '@island.is/auth-nest-tools'
import { ListTypes } from '../../dataTypes/listTypes/listType.model'
import { FieldTypes } from '../../dataTypes/fieldTypes/fieldType.model'
import {
  CertificationTypesEnum,
  ListTypesEnum,
  FieldTypesEnum,
} from '@island.is/form-system/shared'
import { AdminPortalScope } from '@island.is/auth/scopes'

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization)
    private readonly organizationModel: typeof Organization,
  ) {}

  async findAdmin(
    user: User,
    nationalId: string,
  ): Promise<OrganizationAdminDto> {
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)

    if (user.nationalId !== nationalId && !isAdmin) {
      throw new UnauthorizedException(`User does not have admin privileges'`)
    }

    // the loader is not sending the nationalId
    if (nationalId === '0') {
      nationalId = user.nationalId
    }

    const organization = await this.organizationModel.findOne({
      where: { nationalId },
      include: ['organizationPermissions'],
    })

    if (!organization) {
      throw new NotFoundException(
        `Organization with nationalId ${nationalId} not found`,
      )
    }

    const organizationAdminDto: OrganizationAdminDto =
      new OrganizationAdminDto()

    organizationAdminDto.organizationId = organization.id

    if (organization.organizationPermissions) {
      organization.organizationPermissions.forEach((permission) => {
        if (
          Object.values(CertificationTypesEnum).includes(permission.permission)
        ) {
          organizationAdminDto.selectedCertificationTypes.push(
            permission.permission,
          )
        } else if (
          Object.values(ListTypesEnum).includes(permission.permission)
        ) {
          organizationAdminDto.selectedListTypes.push(permission.permission)
        } else if (
          Object.values(FieldTypesEnum).includes(permission.permission)
        ) {
          organizationAdminDto.selectedFieldTypes.push(permission.permission)
        }
      })
    }

    organizationAdminDto.certificationTypes = CertificationTypes
    organizationAdminDto.ListTypes = ListTypes
    organizationAdminDto.FieldTypes = FieldTypes

    organizationAdminDto.organizations = await this.organizationModel
      .findAll({
        attributes: ['nationalId'],
      })
      .then((organizations) => {
        return organizations.map((organization) => {
          return {
            label: '',
            value: organization.nationalId,
            isSelected: organization.nationalId === nationalId,
          } as Option
        })
      })

    return organizationAdminDto
  }
}
