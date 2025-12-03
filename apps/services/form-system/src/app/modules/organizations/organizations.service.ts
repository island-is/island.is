import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Form } from '../forms/models/form.model'
import { CreateOrganizationDto } from './models/dto/createOrganization.dto'
import { Organization } from './models/organization.model'
import { OrganizationsResponseDto } from './models/dto/organizations.response.dto'
import { OrganizationDto } from './models/dto/organization.dto'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'
import { FormDto } from '../forms/models/dto/form.dto'
import { OrganizationAdminDto } from './models/dto/organizationAdmin.dto'
import { CertificationTypes } from '../../dataTypes/certificationTypes/certificationType.model'
import { Option } from '../../dataTypes/option.model'
import { User } from '@island.is/auth-nest-tools'
import { jwtDecode } from 'jwt-decode'
import { ListTypes } from '../../dataTypes/listTypes/listType.model'
import { FieldTypes } from '../../dataTypes/fieldTypes/fieldType.model'
import {
  CertificationTypesEnum,
  ListTypesEnum,
  FieldTypesEnum,
} from '@island.is/form-system/shared'
import { UrlTypes } from '@island.is/form-system/enums'
import { OrganizationUrl } from '../organizationUrls/models/organizationUrl.model'

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization)
    private readonly organizationModel: typeof Organization,
  ) {}

  async findAll(): Promise<OrganizationsResponseDto> {
    const organizations = await this.organizationModel.findAll()

    const organizationsDto: OrganizationDto[] = []

    const keys = ['id', 'name', 'nationalId']
    organizations.map((organization) => {
      organizationsDto.push(
        defaults(
          pick(organization, keys),
          zipObject(keys, Array(keys.length).fill(null)),
        ) as OrganizationDto,
      )
    })

    const organizationsResponse: OrganizationsResponseDto =
      new OrganizationsResponseDto()
    organizationsResponse.organizations = organizationsDto

    return organizationsResponse
  }

  async findAdmin(
    user: User,
    nationalId: string,
  ): Promise<OrganizationAdminDto> {
    const token = jwtDecode<{ name: string; nationalId: string }>(
      user.authorization,
    )

    // the loader is not sending the nationalId
    if (nationalId === '0') {
      nationalId = token.nationalId
    }

    const organization = await this.organizationModel.findOne({
      where: { nationalId },
      include: ['organizationPermissions', 'organizationUrls'],
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

    const mapUrls = (urls: OrganizationUrl[], urlType: string) =>
      urls
        .filter((url) => url.type === urlType)
        .map((url) => ({
          id: url.id,
          url: url.url,
          type: url.type,
          method: url.method,
          isTest: url.isTest,
          isXroad: url.isXroad,
        }))

    if (organization.organizationUrls) {
      organizationAdminDto.submitUrls = mapUrls(
        organization.organizationUrls,
        UrlTypes.SUBMIT,
      )
      organizationAdminDto.validationUrls = mapUrls(
        organization.organizationUrls,
        UrlTypes.VALIDATION,
      )
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

  async findOne(id: string): Promise<OrganizationDto> {
    const organization = await this.organizationModel.findByPk(id, {
      include: [Form],
    })

    if (!organization) {
      throw new NotFoundException(`Organization with id ${id} not found`)
    }

    const keys = ['id', 'nationalId']
    const organizationDto: OrganizationDto = defaults(
      pick(organization, keys),
      zipObject(keys, Array(keys.length).fill(null)),
    ) as OrganizationDto

    const formKeys = [
      'id',
      'name',
      'slug',
      'invalidationDate',
      'created',
      'modified',
      'isTranslated',
      'daysUntilApplicationPrune',
      'allowProceedOnValidationFail',
      'hasSummaryScreen',
      'hasPayment',
    ]

    organizationDto.forms = organization.forms?.map((form) => {
      return defaults(
        pick(form, formKeys),
        zipObject(formKeys, Array(formKeys.length).fill(null)),
      ) as FormDto
    })

    return organizationDto
  }

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<OrganizationDto> {
    const organization = createOrganizationDto as Organization
    const newOrganzation: Organization = new this.organizationModel(
      organization,
    )
    await newOrganzation.save()

    const keys = ['id', 'nationalId']
    const organizationDto: OrganizationDto = defaults(
      pick(newOrganzation, keys),
      zipObject(keys, Array(keys.length).fill(null)),
    ) as OrganizationDto

    return organizationDto
  }
}
