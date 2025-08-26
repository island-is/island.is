import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { FormApplicantType } from './models/formApplicantType.model'
import { Form } from '../forms/models/form.model'
import { CreateFormApplicantTypeDto } from './models/dto/createFormApplicantType.dto'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'
import { UpdateFormApplicantTypeDto } from './models/dto/updateFormApplicantType.dto'
import { ApplicantTypes } from '../../dataTypes/applicantTypes/applicantType.model'
import { ApplicantTypesEnum } from '@island.is/form-system/shared'
import { FormApplicantTypeDto } from './models/dto/formApplicantType.dto'

@Injectable()
export class FormApplicantTypesService {
  constructor(
    @InjectModel(FormApplicantType)
    private readonly formApplicantTypeModel: typeof FormApplicantType,
    @InjectModel(Form)
    private readonly formModel: typeof Form,
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

    const form = await this.formModel.findByPk(
      createFormApplicantTypeDto.formId,
    )
    if (!form) {
      throw new NotFoundException(
        `Form with id '${createFormApplicantTypeDto.formId}' not found`,
      )
    }

    let allowedDelegationTypes: string[] = []

    if (Array.isArray(form.allowedDelegationTypes)) {
      allowedDelegationTypes = [...form.allowedDelegationTypes]
    } else if (
      form.allowedDelegationTypes &&
      typeof form.allowedDelegationTypes === 'object'
    ) {
      allowedDelegationTypes = Object.values(form.allowedDelegationTypes)
    } else {
      allowedDelegationTypes = []
    }

    const delegationType = await this.getDelegationType(
      createFormApplicantTypeDto.applicantTypeId,
    )
    if (
      delegationType !== 'Other' &&
      !allowedDelegationTypes.includes(delegationType)
    ) {
      allowedDelegationTypes.push(delegationType)
      form.allowedDelegationTypes = allowedDelegationTypes
      await form.save()
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

    const form = await this.formModel.findByPk(formApplicantType.formId)
    if (!form) {
      throw new NotFoundException(
        `Form with id '${formApplicantType.formId}' not found`,
      )
    }

    let allowedDelegationTypes: string[] = []

    if (Array.isArray(form.allowedDelegationTypes)) {
      allowedDelegationTypes = [...form.allowedDelegationTypes]
    } else if (
      form.allowedDelegationTypes &&
      typeof form.allowedDelegationTypes === 'object'
    ) {
      allowedDelegationTypes = Object.values(form.allowedDelegationTypes)
    } else {
      allowedDelegationTypes = []
    }

    const delegationType = await this.getDelegationType(
      formApplicantType.applicantTypeId,
    )

    const updatedDelegationTypes = allowedDelegationTypes.filter(
      (type) => type !== delegationType,
    )

    form.allowedDelegationTypes = updatedDelegationTypes
    await form.save()

    formApplicantType.destroy()
  }

  private async getDelegationType(applicantType: string): Promise<string> {
    switch (applicantType) {
      case ApplicantTypesEnum.INDIVIDUAL:
        return 'Individual'
      case ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_INDIVIDUAL:
        return 'GeneralMandate'
      case ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_LEGAL_ENTITY:
        return 'Custom'
      case ApplicantTypesEnum.INDIVIDUAL_WITH_PROCURATION:
        return 'ProcurationHolder'
      case ApplicantTypesEnum.LEGAL_GUARDIAN:
        return 'LegalGuardian'
      default:
        return 'Other'
    }
  }
}
