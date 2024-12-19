import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { FormCertificationType } from './models/formCertificationType.model'
import { CreateFormCertificationTypeDto } from './models/dto/createFormCertificationType.dto'
import { CertificationTypes } from '../../dataTypes/certificationTypes/certificationType.model'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'
import { FormCertificationTypeDto } from './models/dto/formCertificationType.dto'

@Injectable()
export class FormCertificationTypesService {
  constructor(
    @InjectModel(FormCertificationType)
    private readonly formCertificationTypeModel: typeof FormCertificationType,
  ) {}

  async create(
    createFormCertificationTypeDto: CreateFormCertificationTypeDto,
  ): Promise<FormCertificationTypeDto> {
    const certificationType = CertificationTypes.find(
      (certificationType) =>
        certificationType.id ===
        createFormCertificationTypeDto.certificationTypeId,
    )

    if (!certificationType) {
      throw new NotFoundException(
        `certificationType with id '${createFormCertificationTypeDto.certificationTypeId}' not found`,
      )
    }

    const formCertificationType =
      createFormCertificationTypeDto as FormCertificationType

    const newFormCertificationType: FormCertificationType =
      new this.formCertificationTypeModel(formCertificationType)

    await newFormCertificationType.save()

    const keys = ['id', 'certificationTypeId']
    const formCertificationTypeDto: FormCertificationTypeDto = defaults(
      pick(newFormCertificationType, keys),
      zipObject(keys, Array(keys.length).fill(null)),
    ) as FormCertificationTypeDto

    return formCertificationTypeDto
  }

  async delete(id: string): Promise<void> {
    const formCertificationType =
      await this.formCertificationTypeModel.findByPk(id)

    if (!formCertificationType) {
      throw new NotFoundException(
        `Form certification type with id '${id}' not found`,
      )
    }

    formCertificationType.destroy()
  }
}
