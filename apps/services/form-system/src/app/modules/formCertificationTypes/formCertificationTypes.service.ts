import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { FormCertificationType } from './models/formCertificationType.model'
import { CreateFormCertificationTypeDto } from './models/dto/createFormCertificationType.dto'
import { CertificationTypes } from '../../dataTypes/certificationTypes/certificationType.model'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'
import { FormCertificationTypeDto } from './models/dto/formCertificationType.dto'
import { User } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { Form } from '../forms/models/form.model'

@Injectable()
export class FormCertificationTypesService {
  constructor(
    @InjectModel(FormCertificationType)
    private readonly formCertificationTypeModel: typeof FormCertificationType,
    @InjectModel(Form)
    private readonly formModel: typeof Form,
  ) {}

  async create(
    user: User,
    createFormCertificationTypeDto: CreateFormCertificationTypeDto,
  ): Promise<FormCertificationTypeDto> {
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)

    const form = await this.formModel.findByPk(
      createFormCertificationTypeDto.formId,
    )

    if (!form) {
      throw new NotFoundException(
        `Form with id '${createFormCertificationTypeDto.formId}' not found`,
      )
    }

    const formOwnerNationalId = form.organizationNationalId
    if (user.nationalId !== formOwnerNationalId && !isAdmin) {
      throw new NotFoundException(
        `User with nationalId '${user.nationalId}' does not have permission to create form certification type for form with id '${createFormCertificationTypeDto.formId}'`,
      )
    }

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

  async delete(user: User, id: string): Promise<void> {
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)

    const formCertificationType =
      await this.formCertificationTypeModel.findByPk(id)

    if (!formCertificationType) {
      throw new NotFoundException(
        `Form certification type with id '${id}' not found`,
      )
    }

    const form = await this.formModel.findByPk(formCertificationType.formId)

    if (!form) {
      throw new NotFoundException(
        `Form with id '${formCertificationType.formId}' not found`,
      )
    }

    const formOwnerNationalId = form.organizationNationalId
    if (user.nationalId !== formOwnerNationalId && !isAdmin) {
      throw new NotFoundException(
        `User with nationalId '${user.nationalId}' does not have permission to delete form certification type for form with id '${formCertificationType.formId}'`,
      )
    }

    await formCertificationType.destroy()
  }
}
