import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Organization } from './models/organization.model'
import { Form } from '../forms/models/form.model'
import { CreateOrganizationDto } from './models/dto/createOrganization.dto'
import { InputType } from '../inputs/models/inputType.model'

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization)
    private readonly organizationModel: typeof Organization, // @InjectModel(InputType)
  ) // private readonly inputTypeModel: typeof InputType,
  {}

  async findAll(): Promise<Organization[]> {
    return await this.organizationModel.findAll()
  }

  async findOne(id: string): Promise<Organization | null> {
    const form = await this.organizationModel.findByPk(id, { include: [Form] })

    return form
  }

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    const organization = createOrganizationDto as Organization
    const newOrganzation: Organization = new this.organizationModel(
      organization,
    )
    return await newOrganzation.save()
  }

  // async findInputTypes(organizationId: string): Promise<InputType[]> {
  //   const commons = await this.inputTypeModel.findAll({
  //     where: { isCommon: true },
  //   })
  //   return commons
  // }
}
