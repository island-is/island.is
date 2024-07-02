import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Form } from '../forms/models/form.model'
import { CreateOrganizationDto } from './models/dto/createOrganization.dto'
import { Organization } from './models/organization.model'

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization)
    private readonly organizationModel: typeof Organization,
  ) {}

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
}
