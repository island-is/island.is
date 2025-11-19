import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Form } from '../forms/models/form.model'
import { CreateFormApplicantTypeDto } from './models/dto/createFormApplicantType.dto'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'
import { ApplicantTypes } from '../../dataTypes/applicantTypes/applicantType.model'
import {
  ApplicantTypesEnum,
  FieldTypesEnum,
  SectionTypes,
} from '@island.is/form-system/shared'
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
        await form.save({ transaction })
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

    // Update allowedDelegationTypes
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
      deleteFormApplicantTypeDto.applicantTypeId,
    )
    const updatedDelegationTypes = allowedDelegationTypes.filter(
      (type) => type !== delegationType,
    )
    form.allowedDelegationTypes = updatedDelegationTypes
    await form.save()

    const screenDto = this.mapToScreenDto(targetScreen, targetScreen.fields[0])

    await this.screenModel.destroy({ where: { id: targetScreen.id } })

    return screenDto
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
