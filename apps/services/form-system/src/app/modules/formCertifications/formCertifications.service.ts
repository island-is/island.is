import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { FormCertification } from './models/formCertification.model'
import { CreateFormCertificationDto } from './models/dto/createFormCertification.dto'
import { FormCertificationDto } from './models/dto/formCertification.dto'
import { Certifications } from '../../dataTypes/certificationType.model'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'

@Injectable()
export class FormCertificationsService {
  constructor(
    @InjectModel(FormCertification)
    private readonly formCertificationModel: typeof FormCertification,
  ) {}

  async create(
    createFormCertificationDto: CreateFormCertificationDto,
  ): Promise<FormCertificationDto> {
    const formCertification = createFormCertificationDto as FormCertification
    const newFormCertification: FormCertification =
      new this.formCertificationModel(formCertification)
    await newFormCertification.save()

    const certification = Certifications.find(
      (x) => x.id == newFormCertification.certificationId,
    )

    const keys = ['id', 'type', 'name', 'description']
    const formCertificationDto: FormCertificationDto = defaults(
      pick({ ...certification, id: newFormCertification.id }, keys),
      zipObject(keys, Array(keys.length).fill(null)),
    ) as FormCertificationDto

    return formCertificationDto
  }

  async delete(id: string): Promise<void> {
    const formCertification = await this.formCertificationModel.findByPk(id)

    if (!formCertification) {
      throw new NotFoundException(
        `Form certification with id '${id}' not found`,
      )
    }

    formCertification.destroy()
  }
}
