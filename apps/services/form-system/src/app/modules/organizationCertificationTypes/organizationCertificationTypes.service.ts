import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { OrganizationCertificationType } from './models/organizationCertificationType.model'
import { UpdateOrganizationCertificationTypeDto } from './models/dto/updateOrganizationCertificationType.dto'
import { OrganizationCertificationTypeDto } from './models/dto/organizationCertificationType.dto'
import { CertificationTypes } from '../../dataTypes/certificationTypes/certificationType.model'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'

@Injectable()
export class OrganizationCertificationTypesService {
  constructor(
    @InjectModel(OrganizationCertificationType)
    private readonly organizationCertificationTypeModel: typeof OrganizationCertificationType,
  ) {}

  async create(
    createOrganizationCertificationTypeDto: UpdateOrganizationCertificationTypeDto,
  ): Promise<OrganizationCertificationTypeDto> {
    const certificationType = CertificationTypes.find(
      (certificationType) =>
        certificationType.id ===
        createOrganizationCertificationTypeDto.certificationTypeId,
    )

    if (!certificationType) {
      throw new NotFoundException(
        `certificationType with id '${createOrganizationCertificationTypeDto.certificationTypeId}' not found`,
      )
    }

    const organizationCertificationType =
      createOrganizationCertificationTypeDto as OrganizationCertificationType

    const newOrganizationCertificationType: OrganizationCertificationType =
      new this.organizationCertificationTypeModel(organizationCertificationType)

    console.log(
      'newOrganizationCertificationType',
      newOrganizationCertificationType,
    )

    await newOrganizationCertificationType.save()

    // const newOrganizationCertificationType =
    //   await this.organizationCertificationTypeModel.create({
    //     organizationId:
    //     organizationCertificationType.organizationId,
    //     certificationTypeId:
    //     organizationCertificationType.certificationTypeId,
    //   })

    const keys = ['id', 'certificationTypeId']
    const organizationCertificationTypeDto: OrganizationCertificationTypeDto =
      defaults(
        pick(newOrganizationCertificationType, keys),
        zipObject(keys, Array(keys.length).fill(null)),
      ) as OrganizationCertificationTypeDto

    return organizationCertificationTypeDto
  }

  async delete(
    deleteOrganizationCertificationTypeDto: UpdateOrganizationCertificationTypeDto,
  ): Promise<void> {
    const organizationCertificationType =
      await this.organizationCertificationTypeModel.findOne({
        where: {
          organizationId: deleteOrganizationCertificationTypeDto.organizationId,
          certificationTypeId:
            deleteOrganizationCertificationTypeDto.certificationTypeId,
        },
      })

    if (!organizationCertificationType) {
      {
        throw new NotFoundException(
          `Organization certification type with 
        organizationId '${deleteOrganizationCertificationTypeDto.organizationId}' and
        certificationTypeId '${deleteOrganizationCertificationTypeDto.certificationTypeId}' not found`,
        )
      }
    }
    organizationCertificationType.destroy()
  }
}
