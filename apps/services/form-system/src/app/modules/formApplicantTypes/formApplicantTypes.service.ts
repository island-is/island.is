import { Injectable, NotFoundException } from '@nestjs/common'
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
    createFormApplicantTypeDto: CreateFormApplicantTypeDto,
  ): Promise<ScreenDto> {
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
          },
        ],
      },
    )

    if (!form) {
      throw new NotFoundException(
        `Form with id '${createFormApplicantTypeDto.formId}' not found`,
      )
    }

    let screenDto = new ScreenDto()

    await this.sequelize.transaction(async (transaction) => {
      const lockedForm = await this.formModel.findByPk(
        createFormApplicantTypeDto.formId,
        {
          transaction,
          lock: transaction.LOCK.UPDATE,
        },
      )
      if (!lockedForm) throw new NotFoundException('Form not found')

      const loginType = createFormApplicantTypeDto.applicantTypeId
      const current: string[] = Array.isArray(lockedForm.allowedLoginTypes)
        ? lockedForm.allowedLoginTypes
        : Object.values(lockedForm.allowedLoginTypes ?? {})

      if (!current.includes(loginType)) {
        const next = [...current, loginType]
        lockedForm.set('allowedLoginTypes', next)
        lockedForm.changed('allowedLoginTypes', true)
        await lockedForm.save({ transaction })
      }

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
    deleteFormApplicantTypeDto: DeleteFormApplicantTypeDto,
  ): Promise<ScreenDto> {
    const form = await this.formModel.findByPk(
      deleteFormApplicantTypeDto.formId,
    )

    if (!form) {
      throw new NotFoundException(
        `Form with id '${deleteFormApplicantTypeDto.formId}' not found`,
      )
    }

    const partiesSection = await Section.findOne({
      where: { formId: form.id, sectionType: SectionTypes.PARTIES },
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

    await this.sequelize.transaction(async (transaction) => {
      const lockedForm = await this.formModel.findByPk(
        deleteFormApplicantTypeDto.formId,
        {
          transaction,
          lock: transaction.LOCK.UPDATE,
        },
      )
      if (!lockedForm) throw new NotFoundException('Form not found')

      const loginType = deleteFormApplicantTypeDto.applicantTypeId
      const current: string[] = Array.isArray(lockedForm.allowedLoginTypes)
        ? lockedForm.allowedLoginTypes
        : Object.values(lockedForm.allowedLoginTypes ?? {})
      const next = current.filter((t) => t !== loginType)
      lockedForm.set('allowedLoginTypes', next)
      lockedForm.changed('allowedLoginTypes', true)
      await lockedForm.save({ transaction })

      screenDto = this.mapToScreenDto(targetScreen, targetScreen.fields[0])

      await this.screenModel.destroy({
        where: { id: targetScreen.id },
        transaction,
      })
    })

    return screenDto
  }

  private mapToScreenDto(screen: Screen, field: Field): ScreenDto {
    const fieldKeys = [
      'id',
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
      'sectionId',
      'name',
      'displayOrder',
      'isCompleted',
      'callRuleset',
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
