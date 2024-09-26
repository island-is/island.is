import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { FormApplicant } from './models/formApplicant.model'
import { CreateFormApplicantDto } from './models/dto/createFormApplicant.dto'
import { FormApplicantDto } from './models/dto/formApplicant.dto'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'
import { UpdateFormApplicantDto } from './models/dto/updateFormApplicant.dto'

@Injectable()
export class FormApplicantsService {
  constructor(
    @InjectModel(FormApplicant)
    private readonly formApplicantModel: typeof FormApplicant,
  ) {}

  async create(
    createFormApplicantDto: CreateFormApplicantDto,
  ): Promise<FormApplicantDto> {
    const formApplicant = createFormApplicantDto as FormApplicant
    const newFormApplicant: FormApplicant = new this.formApplicantModel(
      formApplicant,
    )
    await newFormApplicant.save()

    const keys = ['id', 'applicantType']
    const formApplicantDto: FormApplicantDto = defaults(
      pick(newFormApplicant, keys),
      zipObject(keys, Array(keys.length).fill(null)),
    ) as FormApplicantDto

    return formApplicantDto
  }

  async update(
    id: string,
    updateFormApplicantDto: UpdateFormApplicantDto,
  ): Promise<void> {
    const formApplicant = await this.formApplicantModel.findByPk(id)

    if (!formApplicant) {
      throw new NotFoundException(`Form applicant with id '${id}' not found`)
    }

    formApplicant.name = updateFormApplicantDto.name

    await formApplicant.save()
  }

  async delete(id: string): Promise<void> {
    const formApplicant = await this.formApplicantModel.findByPk(id)

    if (!formApplicant) {
      throw new NotFoundException(`Form applicant with id '${id}' not found`)
    }

    formApplicant.destroy()
  }
}
