import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Form } from '../forms/models/form.model'
import { CreateFormApplicantTypeDto } from './models/dto/createFormApplicantType.dto'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'
import { ApplicantTypes } from '../../dataTypes/applicantTypes/applicantType.model'
import { FieldTypesEnum, SectionTypes } from '@island.is/form-system/shared'
import { ScreenDto } from '../screens/models/dto/screen.dto'
import { Field } from '../fields/models/field.model'
import { Screen } from '../screens/models/screen.model'
import { Section } from '../sections/models/section.model'
import { FieldSettings } from '../../dataTypes/fieldSettings/fieldSettings.model'
import { FieldDto } from '../fields/models/dto/field.dto'
import { DeleteFormApplicantTypeDto } from './models/dto/deleteFormApplicantType.dto'
import { Sequelize } from 'sequelize-typescript'
import { User } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'

@Injectable()
export class FormApplicantTypesService {
  constructor(
    @InjectModel(Form)
    private readonly formModel: typeof Form,
    @InjectModel(Screen)
    private readonly screenModel: typeof Screen,
    @InjectModel(Field)
    private readonly fieldModel: typeof Field,
    private readonly sequelize: Sequelize,
  ) {}

  async create(
    user: User,
    createFormApplicantTypeDto: CreateFormApplicantTypeDto,
  ): Promise<ScreenDto> {
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)

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
      {
        include: [
          {
            model: Section,
            as: 'sections',
            where: { sectionType: SectionTypes.PARTIES },
          },
        ],
      },
    )

    if (!form) {
      throw new NotFoundException(
        `Form with id '${createFormApplicantTypeDto.formId}' not found`,
      )
    }

    const formOwnerNationalId = form.organizationNationalId
    if (user.nationalId !== formOwnerNationalId && !isAdmin) {
      throw new UnauthorizedException(
        `User with nationalId '${user.nationalId}' does not have permission to create form applicant type with id '${createFormApplicantTypeDto.applicantTypeId}'`,
      )
    }

    let screenDto = new ScreenDto()

    await this.sequelize.transaction(async (transaction) => {
      const newScreen = await this.screenModel.create(
        {
          sectionId: form.sections[0].id, // PARTIES is the only section
          name: applicantType.description,
        } as Screen,
        { transaction },
      )

      const newField = await this.fieldModel.create(
        {
          screenId: newScreen.id,
          fieldType: FieldTypesEnum.APPLICANT,
          fieldSettings: {
            applicantType: applicantType.id,
          } as FieldSettings,
        } as Field,
        { transaction },
      )

      screenDto = this.mapToScreenDto(newScreen, newField)
    })
    return screenDto
  }

  async delete(
    user: User,
    deleteFormApplicantTypeDto: DeleteFormApplicantTypeDto,
  ): Promise<ScreenDto> {
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)

    const partiesSection = await Section.findOne({
      where: {
        formId: deleteFormApplicantTypeDto.formId,
        sectionType: SectionTypes.PARTIES,
      },
      include: [
        {
          model: Screen,
          as: 'screens',
          include: [
            {
              model: Field,
              as: 'fields',
            },
          ],
        },
      ],
    })

    if (!partiesSection) {
      throw new NotFoundException('PARTIES section not found for form')
    }

    const form = await this.formModel.findByPk(partiesSection.formId, {
      attributes: ['organizationNationalId'],
      raw: true,
    })
    if (!form) {
      throw new NotFoundException(
        `Form with id '${partiesSection.formId}' not found`,
      )
    }

    const formOwnerNationalId = form.organizationNationalId
    if (user.nationalId !== formOwnerNationalId && !isAdmin) {
      throw new UnauthorizedException(
        `User with nationalId '${user.nationalId}' does not have permission to delete form applicant type with id '${deleteFormApplicantTypeDto.applicantTypeId}'`,
      )
    }

    const targetScreen = partiesSection?.screens?.find((screen) =>
      (screen.fields ?? []).some(
        (f) =>
          f.fieldSettings &&
          (f.fieldSettings as FieldSettings).applicantType ===
            deleteFormApplicantTypeDto.applicantTypeId,
      ),
    )

    if (
      !targetScreen ||
      !targetScreen.fields ||
      targetScreen.fields.length === 0
    ) {
      throw new NotFoundException(
        `Screen with applicant type id '${deleteFormApplicantTypeDto.applicantTypeId}' not found`,
      )
    }

    let screenDto: ScreenDto = new ScreenDto()

    screenDto = this.mapToScreenDto(targetScreen, targetScreen.fields[0])

    await this.screenModel.destroy({
      where: { id: targetScreen.id },
    })

    return screenDto
  }

  private mapToScreenDto(screen: Screen, field: Field): ScreenDto {
    const fieldKeys = [
      'id',
      'identifier',
      'screenId',
      'name',
      'displayOrder',
      'description',
      'isPartOfMultiset',
      'isRequired',
      'fieldType',
      'fieldSettings',
    ]
    const fieldDto: FieldDto = defaults(
      pick(field, fieldKeys),
      zipObject(fieldKeys, Array(fieldKeys.length).fill(null)),
    ) as FieldDto

    const screenKeys = [
      'id',
      'identifier',
      'sectionId',
      'name',
      'displayOrder',
      'isCompleted',
      'shouldValidate',
      'shouldPopulate',
      'isHidden',
      'multiset',
    ]
    const screenDto: ScreenDto = defaults(
      pick(screen, screenKeys),
      zipObject(screenKeys, Array(screenKeys.length).fill(null)),
    ) as ScreenDto

    screenDto.fields = [fieldDto]

    return screenDto
  }
}
