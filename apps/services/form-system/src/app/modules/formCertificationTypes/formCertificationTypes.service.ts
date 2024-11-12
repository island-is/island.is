import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { FormCertificationType } from './models/formCertificationType.model'
import { CreateFormCertificationTypeDto } from './models/dto/createFormCertificationType.dto'
// import { FormCertificationDto } from './models/dto/formCertification.dto'
import {
  CertificationType,
  CertificationTypes,
} from '../../dataTypes/certificationTypes/certificationType.model'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'

@Injectable()
export class FormCertificationTypesService {
  constructor(
    @InjectModel(FormCertificationType)
    private readonly formCertificationTypeModel: typeof FormCertificationType,
  ) {}

  async create(
    createFormCertificationTypeDto: CreateFormCertificationTypeDto,
  ): Promise<CertificationType> {
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

    certificationType.formCertificationId = newFormCertificationType.id

    // certificationType.id = newFormCertification.id

    // const certification = CertificationTypes.find(
    //   (x) => x.id == newFormCertification.certificationId,
    // )

    // const keys = ['id', 'type', 'name', 'description']
    // const formCertificationDto: FormCertificationDto = defaults(
    //   pick({ ...certification, id: newFormCertification.id }, keys),
    //   zipObject(keys, Array(keys.length).fill(null)),
    // ) as FormCertificationDto

    return certificationType
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
