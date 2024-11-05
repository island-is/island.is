import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'

import { SectionTypes } from '../../enums/sectionTypes'
import { FormApplicantDto } from '../formApplicants/models/dto/formApplicant.dto'
import { ScreenDto } from '../screens/models/dto/screen.dto'
import { Screen } from '../screens/models/screen.model'
import { FieldSettingsMapper } from '../fieldSettings/models/fieldSettings.mapper'
import { FieldSettings } from '../fieldSettings/models/fieldSettings.model'
import { FieldDto } from '../fields/models/dto/field.dto'
import { FieldTypeDto } from '../fields/models/dto/fieldType.dto'
import { Field } from '../fields/models/field.model'
import { FieldType } from '../fields/models/fieldType.model'
import { ListTypeDto } from '../lists/models/dto/listType.dto'
import { ListType } from '../lists/models/listType.model'
import { Organization } from '../organizations/models/organization.model'
import { SectionDto } from '../sections/models/dto/section.dto'
import { Section } from '../sections/models/section.model'
import { FormCertificationDto } from '../formCertifications/models/dto/formCertification.dto'
// import { Certification } from '../certifications/models/certification.model'
import { CreateFormDto } from './models/dto/createForm.dto'
import { FormDto } from './models/dto/form.dto'
import { FormResponseDto } from './models/dto/form.response.dto'
import { Form } from './models/form.model'
import { ListItem } from '../listItems/models/listItem.model'
import { createFormTranslations } from '../translations/form'
import { createSectionTranslations } from '../translations/section'
import { UpdateFormDto } from './models/dto/updateForm.dto'
import { OrganizationCertification } from '../organizationCertifications/models/organizationCertification.model'
import { Certifications } from '../../dataTypes/certificationType.model'
import { FormCertification } from '../formCertifications/models/formCertification.model'
import {
  ApplicantType,
  ApplicantTypes,
} from '../../dataTypes/applicantType.model'
import { FormApplicant } from '../formApplicants/models/formApplicant.model'
// import { ValueType } from '../../dataTypes/valueTypes/valueType.model'
import { ValueFactory } from '../../dataTypes/valueTypes/valueType.factory'

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Form)
    private readonly formModel: typeof Form,
    @InjectModel(Section)
    private readonly sectionModel: typeof Section,
    @InjectModel(Screen)
    private readonly screenModel: typeof Screen,
    @InjectModel(Organization)
    private readonly organizationModel: typeof Organization,
    @InjectModel(FieldType)
    private readonly fieldTypeModel: typeof FieldType,
    @InjectModel(ListType)
    private readonly listTypeModel: typeof ListType,
    private readonly fieldSettingsMapper: FieldSettingsMapper,
  ) {}

  async findAll(organizationId: string): Promise<FormResponseDto> {
    const forms = await this.formModel.findAll({
      where: { organizationId: organizationId },
    })

    const keys = [
      'id',
      'name',
      'slug',
      'invalidationDate',
      'created',
      'modified',
      'isTranslated',
      'applicationDaysToRemove',
      'stopProgressOnValidatingScreen',
    ]

    const formResponseDto: FormResponseDto = {
      forms: forms.map((form) => {
        return defaults(
          pick(form, keys),
          zipObject(keys, Array(keys.length).fill(null)),
        ) as FormDto
      }),
    }

    return formResponseDto
  }

  async findOne(id: string): Promise<FormResponseDto | null> {
    const form = await this.findById(id)

    if (!form) {
      return null
    }
    const formResponse = await this.buildFormResponse(form)

    return formResponse
  }

  async create(createFormDto: CreateFormDto): Promise<FormResponseDto | null> {
    const { organizationId } = createFormDto

    if (!organizationId) {
      throw new Error('Missing organizationId')
    }

    const organization = this.organizationModel.findByPk(organizationId)
    if (!organization) {
      throw new NotFoundException(
        `Organization with id ${organizationId} not found`,
      )
    }

    const newForm: Form = await this.formModel.create({
      organizationId: organizationId,
    } as Form)

    await this.createFormTemplate(newForm)

    const form = await this.findById(newForm.id)

    const formResponse = await this.buildFormResponse(form)

    return formResponse
  }

  async update(id: string, updateFormDto: UpdateFormDto): Promise<void> {
    const form = await this.formModel.findByPk(id)

    if (!form) {
      throw new NotFoundException(`Form with id '${id}' not found`)
    }

    form.organizationId = updateFormDto.organizationId
      ? updateFormDto.organizationId
      : form.organizationId
    form.name = updateFormDto.name ? updateFormDto.name : form.name
    form.slug = updateFormDto.slug ? updateFormDto.slug : form.slug
    form.invalidationDate = updateFormDto.invalidationDate
      ? updateFormDto.invalidationDate
      : form.invalidationDate
    form.isTranslated = updateFormDto.isTranslated
      ? updateFormDto.isTranslated
      : form.isTranslated
    form.applicationDaysToRemove = updateFormDto.applicationDaysToRemove
      ? updateFormDto.applicationDaysToRemove
      : form.applicationDaysToRemove
    form.stopProgressOnValidatingScreen =
      updateFormDto.stopProgressOnValidatingScreen
        ? updateFormDto.stopProgressOnValidatingScreen
        : form.stopProgressOnValidatingScreen
    form.completedMessage = updateFormDto.completedMessage
    form.dependencies = updateFormDto.dependencies

    await form.save()
  }

  async delete(id: string): Promise<void> {
    const form = await this.findById(id)

    if (!form) {
      throw new NotFoundException(`Form with id '${id}' not found`)
    }

    form.destroy()
  }

  private async findById(id: string): Promise<Form> {
    const form = await this.formModel.findByPk(id, {
      include: [
        {
          model: Section,
          as: 'sections',
          include: [
            {
              model: Screen,
              as: 'screens',
              include: [
                {
                  model: Field,
                  as: 'fields',
                  include: [
                    {
                      model: FieldSettings,
                      as: 'fieldSettings',
                      include: [
                        {
                          model: ListItem,
                          as: 'list',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: FormCertification,
          as: 'certifications',
        },
        {
          model: FormApplicant,
          as: 'applicants',
        },
      ],
    })

    if (!form) {
      throw new NotFoundException(`Form with id '${id}' not found`)
    }

    return form
  }

  private async buildFormResponse(form: Form): Promise<FormResponseDto> {
    const response: FormResponseDto = {
      form: this.setArrays(form),
      fieldTypes: await this.getFieldTypes(form.organizationId),
      certificationTypes: await this.getCertificationTypes(form.organizationId),
      applicantTypes: await this.getApplicantTypes(),
      listTypes: await this.getListTypes(form.organizationId),
    }

    return response
  }

  private async getApplicantTypes(): Promise<ApplicantType[]> {
    const applicantTypes = ApplicantTypes

    return applicantTypes
  }

  private async getCertificationTypes(
    organizationId: string,
  ): Promise<FormCertificationDto[]> {
    const organization = await this.organizationModel.findByPk(organizationId, {
      include: [OrganizationCertification],
    })

    const certificationsDto: FormCertificationDto[] = []

    const keys = ['id', 'type', 'name', 'description']
    organization?.organizationCertifications?.map((orgCertification) => {
      Certifications.map((certification) => {
        if (orgCertification.certificationId === certification.id) {
          certificationsDto.push(
            defaults(
              pick(certification, keys),
              zipObject(keys, Array(keys.length).fill(null)),
            ) as FormCertificationDto,
          )
        }
      })
    })

    return certificationsDto
  }

  private async getFieldTypes(organizationId: string): Promise<FieldTypeDto[]> {
    const commonFieldTypes = await this.fieldTypeModel.findAll({
      where: { isCommon: true },
    })
    const organizationSpecificFieldTypes =
      await this.organizationModel.findByPk(organizationId, {
        include: [FieldType],
      })

    const organizationFieldTypes = commonFieldTypes.concat(
      organizationSpecificFieldTypes?.organizationFieldTypes as FieldType[],
    )

    const fieldTypesDto: FieldTypeDto[] = []
    const keys = ['id', 'type', 'name', 'description', 'isCommon']
    organizationFieldTypes.map((fieldType) => {
      fieldTypesDto.push(
        Object.assign(
          defaults(
            pick(fieldType, keys),
            zipObject(keys, Array(keys.length).fill(null)),
          ),
          {
            fieldSettings:
              this.fieldSettingsMapper.mapFieldTypeToFieldSettingsDto(
                null,
                fieldType.type,
              ),
          },
        ) as FieldTypeDto,
      )
    })

    return fieldTypesDto
  }

  private async getListTypes(organizationId: string): Promise<ListTypeDto[]> {
    const commonListTypes = await this.listTypeModel.findAll({
      where: { isCommon: true },
    })
    const organizationSpecificListTypes = await this.organizationModel.findByPk(
      organizationId,
      { include: [ListType] },
    )

    const organizationListTypes = commonListTypes.concat(
      organizationSpecificListTypes?.organizationListTypes as ListType[],
    )

    const listTypesDto: ListTypeDto[] = []
    const keys = ['id', 'type', 'name', 'description', 'isCommon']
    organizationListTypes.map((listType) => {
      listTypesDto.push(
        defaults(
          pick(listType, keys),
          zipObject(keys, Array(keys.length).fill(null)),
        ) as ListTypeDto,
      )
    })

    return listTypesDto
  }

  private setArrays(form: Form): FormDto {
    const formKeys = [
      'id',
      'organizationId',
      'name',
      'slug',
      'invalidationDate',
      'created',
      'modified',
      'isTranslated',
      'applicationDaysToRemove',
      'stopProgressOnValidatingScreen',
      'completedMessage',
      'dependencies',
    ]
    const formDto: FormDto = Object.assign(
      defaults(
        pick(form, formKeys),
        zipObject(formKeys, Array(formKeys.length).fill(null)),
      ),
      {
        certifications: [],
        applicants: [],
        sections: [],
        screens: [],
        fields: [],
      },
    ) as FormDto

    const certificationsDto: FormCertificationDto[] = []

    const keys = ['id', 'type', 'name', 'description']
    form?.certifications?.map((formCertification) => {
      Certifications.map((certification) => {
        if (formCertification.certificationId === certification.id) {
          certificationsDto.push(
            defaults(
              pick({ ...certification, id: formCertification.id }, keys),
              zipObject(keys, Array(keys.length).fill(null)),
            ) as FormCertificationDto,
          )
        }
      })
    })

    formDto.certifications = certificationsDto

    const applicantKeys = ['id', 'applicantTypeId', 'name']
    form.applicants?.map((applicant) => {
      formDto.applicants?.push(
        defaults(
          pick(applicant, applicantKeys),
          zipObject(applicantKeys, Array(applicantKeys.length).fill(null)),
        ) as FormApplicantDto,
      )
    })

    const sectionKeys = [
      'id',
      'name',
      'created',
      'modified',
      'sectionType',
      'displayOrder',
      'waitingText',
      'isHidden',
      'isCompleted',
    ]
    const screenKeys = [
      'id',
      'sectionId',
      'name',
      'created',
      'modified',
      'displayOrder',
      'isHidden',
      'multiset',
      'callRuleset',
    ]
    const fieldKeys = [
      'id',
      'screenId',
      'name',
      'created',
      'modified',
      'displayOrder',
      'description',
      'isHidden',
      'isPartOfMultiset',
      'fieldType',
    ]
    form.sections.map((section) => {
      formDto.sections?.push(
        defaults(
          pick(section, sectionKeys),
          zipObject(sectionKeys, Array(sectionKeys.length).fill(null)),
        ) as SectionDto,
      )
      section.screens?.map((screen) => {
        formDto.screens?.push(
          defaults(
            pick(screen, screenKeys),
            zipObject(screenKeys, Array(screenKeys.length).fill(null)),
          ) as ScreenDto,
        )
        screen.fields?.map((field) => {
          formDto.fields?.push(
            Object.assign(
              defaults(
                pick(field, fieldKeys),
                zipObject(fieldKeys, Array(fieldKeys.length).fill(null)),
              ),
              {
                fieldSettings:
                  this.fieldSettingsMapper.mapFieldTypeToFieldSettingsDto(
                    field.fieldSettings,
                    field.fieldType,
                  ),
                // values: [this.createValue(field.fieldType, 0)],
              },
            ) as FieldDto,
          )
        })
      })
    })

    return formDto
  }

  // private createValue(type: string, order: number) {
  //   const ValueClass = ValueFactory.getClass(type)
  //   const value = new ValueClass(order)
  //   return value
  // }

  private async createFormTemplate(form: Form): Promise<void> {
    await this.sectionModel.bulkCreate([
      {
        formId: form.id,
        sectionType: SectionTypes.PREMISES,
        displayOrder: 0,
        name: createFormTranslations.premise,
      } as Section,
      {
        formId: form.id,
        sectionType: SectionTypes.PARTIES,
        displayOrder: 1,
        name: createFormTranslations.parties,
      } as Section,
      {
        formId: form.id,
        sectionType: SectionTypes.PAYMENT,
        displayOrder: 3,
        name: createFormTranslations.payment,
      } as Section,
    ])

    const inputSection = await this.sectionModel.create({
      formId: form.id,
      sectionType: SectionTypes.INPUT,
      displayOrder: 2,
      name: createSectionTranslations.input,
    } as Section)

    await this.screenModel.create({
      sectionId: inputSection.id,
      displayOrder: 0,
      name: createFormTranslations.input,
    } as Screen)
  }
}
