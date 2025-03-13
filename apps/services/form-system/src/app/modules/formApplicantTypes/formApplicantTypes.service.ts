import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { FormApplicantType } from './models/formApplicantType.model'
import { CreateFormApplicantTypeDto } from './models/dto/createFormApplicantType.dto'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'
import { UpdateFormApplicantTypeDto } from './models/dto/updateFormApplicantType.dto'
import { ApplicantTypes } from '../../dataTypes/applicantTypes/applicantType.model'
import { FormApplicantTypeDto } from './models/dto/formApplicantType.dto'

@Injectable()
export class FormApplicantTypesService {
  constructor(
    @InjectModel(FormApplicantType)
    private readonly formApplicantTypeModel: typeof FormApplicantType,
  ) {}

  async create(
    createFormApplicantTypeDto: CreateFormApplicantTypeDto,
  ): Promise<FormApplicantTypeDto> {
    const applicantType = ApplicantTypes.find(
      (applicantType) =>
        applicantType.id === createFormApplicantTypeDto.applicantTypeId,
    )

    if (!applicantType) {
      throw new NotFoundException(
        `Form applicant type with id '${createFormApplicantTypeDto.applicantTypeId}' not found`,
      )
    }

    const formApplicantType = createFormApplicantTypeDto as FormApplicantType
    const newFormApplicantType: FormApplicantType =
      new this.formApplicantTypeModel(formApplicantType)
    await newFormApplicantType.save()

    const keys = ['id', 'applicantTypeId', 'name']
    const formApplicantTypeDto: FormApplicantTypeDto = defaults(
      pick(newFormApplicantType, keys),
      zipObject(keys, Array(keys.length).fill(null)),
    ) as FormApplicantTypeDto

    return formApplicantTypeDto
  }

  async update(
    id: string,
    updateFormApplicantTypeDto: UpdateFormApplicantTypeDto,
  ): Promise<void> {
    const formApplicantType = await this.formApplicantTypeModel.findByPk(id)

    if (!formApplicantType) {
      throw new NotFoundException(`Form applicant with id '${id}' not found`)
    }

    formApplicantType.name = updateFormApplicantTypeDto.name

    await formApplicantType.save()
  }

  async delete(id: string): Promise<void> {
    const formApplicantType = await this.formApplicantTypeModel.findByPk(id)

    if (!formApplicantType) {
      throw new NotFoundException(
        `Form applicant type with id '${id}' not found`,
      )
    }

    formApplicantType.destroy()
  }
}
