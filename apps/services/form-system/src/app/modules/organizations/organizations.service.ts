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
import { OrganizationZendeskInstanceDto } from './models/dto/organizationZendeskInstance.dto'
import { OrganizationDelegationDto } from './models/dto/organizationDelegation.dto'
import { Form } from '../forms/models/form.model'
import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization)
    private readonly organizationModel: typeof Organization,
    @InjectModel(Form)
    private readonly formModel: typeof Form,
    private readonly sequelize: Sequelize,
  ) {}

  async findAdmin(
    user: User,
    nationalId: string,
  ): Promise<OrganizationAdminDto> {
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)

    if (user.nationalId !== nationalId && !isAdmin) {
      throw new UnauthorizedException(`User does not have admin privileges`)
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
    organizationAdminDto.organizationDelegations = organization.delegations

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

  async updateZendeskInstance(
    user: User,
    organizationZendeskInstanceDto: OrganizationZendeskInstanceDto,
  ): Promise<void> {
    const { zendeskInstance, zendeskBrandId, organizationId } =
      organizationZendeskInstanceDto
    const organization = await this.organizationModel.findByPk(organizationId)

    if (!organization) {
      throw new NotFoundException(
        `Organization with ID ${organizationId} not found`,
      )
    }

    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)
    if (!isAdmin && user.nationalId !== organization.nationalId) {
      throw new UnauthorizedException(`User does not have admin privileges`)
    }

    organization.zendeskInstance = zendeskInstance ? zendeskInstance : ''
    organization.zendeskBrandId = zendeskBrandId ? zendeskBrandId : ''

    await organization.save()
  }

  async addDelegation(
    user: User,
    organizationDelegationDto: OrganizationDelegationDto,
  ): Promise<void> {
    await this.sequelize.transaction(async (transaction) => {
      const organization = await this.getOrganizationForUpdate(
        user,
        organizationDelegationDto.organizationNationalId,
        transaction,
      )

      if (
        !organization.delegations.includes(organizationDelegationDto.delegation)
      ) {
        organization.delegations = [
          ...organization.delegations,
          organizationDelegationDto.delegation,
        ]
        await organization.save({ transaction })
      }
    })
  }

  async deleteDelegation(
    user: User,
    organizationDelegationDto: OrganizationDelegationDto,
  ): Promise<void> {
    const { delegation, organizationNationalId } = organizationDelegationDto

    await this.sequelize.transaction(async (transaction) => {
      const organization = await this.getOrganizationForUpdate(
        user,
        organizationNationalId,
        transaction,
      )

      organization.delegations = organization.delegations.filter(
        (organizationDelegation) => organizationDelegation !== delegation,
      )

      await organization.save({ transaction })

      const forms = await this.formModel.findAll({
        where: {
          organizationNationalId,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      })

      await Promise.all(
        forms
          .filter((form) => form.delegations.includes(delegation))
          .map((form) => {
            form.delegations = form.delegations.filter(
              (formDelegation) => formDelegation !== delegation,
            )
            return form.save({ transaction })
          }),
      )
    })
  }

  private async getOrganizationForUpdate(
    user: User,
    organizationNationalId: string,
    transaction: Transaction,
  ): Promise<Organization> {
    const organization = await this.organizationModel.findOne({
      where: { nationalId: organizationNationalId },
      transaction,
      lock: transaction.LOCK.UPDATE,
    })

    if (!organization) {
      throw new NotFoundException(
        `Organization with nationalId ${organizationNationalId} not found`,
      )
    }

    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)
    if (!isAdmin) {
      throw new UnauthorizedException(`User does not have admin privileges`)
    }

    return organization
  }
}
