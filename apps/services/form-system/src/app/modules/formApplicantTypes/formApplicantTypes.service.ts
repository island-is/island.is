import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { FormApplicantType } from './models/formApplicantType.model'
import { CreateFormApplicantTypeDto } from './models/dto/createFormApplicantType.dto'
// import { FormApplicantDto } from './models/dto/formApplicant.dto'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'
import { UpdateFormApplicantTypeDto } from './models/dto/updateFormApplicantType.dto'
import { ApplicantType } from '../../dataTypes/applicantTypes/applicantType.model'

@Injectable()
export class FormApplicantTypesService {
  constructor(
    @InjectModel(FormApplicantType)
    private readonly formApplicantTypeModel: typeof FormApplicantType,
  ) {}

  async create(
    createFormApplicantTypeDto: CreateFormApplicantTypeDto,
  ): Promise<string> {
    const formApplicantType = createFormApplicantTypeDto as FormApplicantType
    const newFormApplicantType: FormApplicantType =
      new this.formApplicantTypeModel(formApplicantType)
    await newFormApplicantType.save()

    // const keys = ['id', 'applicantType']
    // const formApplicantDto: FormApplicantDto = defaults(
    //   pick(newFormApplicant, keys),
    //   zipObject(keys, Array(keys.length).fill(null)),
    // ) as FormApplicantDto

    return newFormApplicantType.id
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
