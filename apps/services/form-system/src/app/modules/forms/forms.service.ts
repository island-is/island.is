import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'

import { SectionTypes } from '../../enums/sectionTypes'
// import { FormApplicantDto } from '../formApplicants/models/dto/formApplicant.dto'
import { ScreenDto } from '../screens/models/dto/screen.dto'
import { Screen } from '../screens/models/screen.model'
// import { FieldSettingsMapper } from '../fieldSettings/models/fieldSettings.mapper'
// import { FieldSettings } from '../fieldSettings/models/fieldSettings.model'
import { FieldDto } from '../fields/models/dto/field.dto'
// import { FieldTypeDto } from '../fields/models/dto/fieldType.dto'
import { Field } from '../fields/models/field.model'
// import { FieldType } from '../fields/models/fieldType.model'
// import { ListTypeDto } from '../organizationListTypes/models/dto/listType.dto'
// import { ListType } from '../organizationListTypes/models/listType.model'
import { Organization } from '../organizations/models/organization.model'
import { SectionDto } from '../sections/models/dto/section.dto'
import { Section } from '../sections/models/section.model'
// import { FormCertificationDto } from '../formCertifications/models/dto/formCertification.dto'
// import { Certification } from '../certifications/models/certification.model'
import { CreateFormDto } from './models/dto/createForm.dto'
import { FormDto } from './models/dto/form.dto'
import { FormResponseDto } from './models/dto/form.response.dto'
import { Form } from './models/form.model'
import { ListItem } from '../listItems/models/listItem.model'
import { createFormTranslations } from '../translations/form'
import { createSectionTranslations } from '../translations/section'
import { UpdateFormDto } from './models/dto/updateForm.dto'
import { OrganizationCertificationType } from '../organizationCertificationTypes/models/organizationCertificationType.model'
import {
  CertificationType,
  CertificationTypes,
} from '../../dataTypes/certificationTypes/certificationType.model'
import { FormCertificationType } from '../formCertificationTypes/models/formCertificationType.model'
import {
  ApplicantType,
  ApplicantTypes,
} from '../../dataTypes/applicantTypes/applicantType.model'
import { FormApplicantType } from '../formApplicantTypes/models/formApplicantType.model'
import { FieldSettings } from '../../dataTypes/fieldSettings/fieldSettings.model'
import { FieldSettingsFactory } from '../../dataTypes/fieldSettings/fieldSettings.factory'
import {
  FieldType,
  FieldTypes,
} from '../../dataTypes/fieldTypes/fieldType.model'
import { OrganizationFieldType } from '../organizationFieldTypes/models/organizationFieldType.model'
import { ValueTypeFactory } from '../../dataTypes/valueTypes/valueType.factory'
import { ValueType } from '../../dataTypes/valueTypes/valueType.model'
import { randomUUID } from 'crypto'
import { ListType, ListTypes } from '../../dataTypes/listTypes/listType.model'
import { OrganizationListType } from '../organizationListTypes/models/organizationListType.model'
// import { ValueType } from '../../dataTypes/valueTypes/valueType.model'
// import { ValueFactory } from '../../dataTypes/valueTypes/valueType.factory'

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
    private readonly organizationModel: typeof Organization, // @InjectModel(FieldType) // private readonly fieldTypeModel: typeof FieldType, // @InjectModel(ListType) // private readonly listTypeModel: typeof ListType, // private readonly fieldSettingsMapper: FieldSettingsMapper,
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
                      model: ListItem,
                      as: 'list',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: FormCertificationType,
          as: 'formCertificationTypes',
        },
        {
          model: FormApplicantType,
          as: 'formApplicantTypes',
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
  ): Promise<CertificationType[]> {
    const commonCertificationTypes = CertificationTypes.filter(
      (certificationType) => certificationType.isCommon,
    )

    const organization = await this.organizationModel.findByPk(organizationId, {
      include: [OrganizationCertificationType],
    })

    const uncommonCertificationTypes = CertificationTypes.filter(
      (certificationType) =>
        organization?.organizationCertificationTypes?.some(
          (item) => item.certificationTypeId === certificationType.id,
        ),
    )

    const organizationCertificationTypes = commonCertificationTypes.concat(
      uncommonCertificationTypes,
    )

    // const organization = await this.organizationModel.findByPk(organizationId, {
    //   include: [OrganizationCertification],
    // })

    // const certificationTypes: CertificationType[] = []

    // const keys = ['id', 'type', 'name', 'description']
    // organization?.organizationCertifications?.map((orgCertification) => {
    //   CertificationTypes.map((certification) => {
    //     if (orgCertification.certificationId === certification.id) {
    //       certificationTypes.push(
    //         defaults(
    //           pick(certification, keys),
    //           zipObject(keys, Array(keys.length).fill(null)),
    //         ) as FormCertificationDto,
    //       )
    //     }
    //   })
    // })

    return organizationCertificationTypes
  }

  private async getFieldTypes(organizationId: string): Promise<FieldType[]> {
    // const commonFieldTypes = await this.fieldTypeModel.findAll({
    //   where: { isCommon: true },
    // })

    const commonFieldTypes = FieldTypes.filter(
      (fieldType) => fieldType.isCommon,
    )

    const organization = await this.organizationModel.findByPk(organizationId, {
      include: [OrganizationFieldType],
    })

    const uncommonFieldTypes = FieldTypes.filter((fieldType) =>
      organization?.organizationFieldTypes?.some(
        (item) => item.fieldTypeId === fieldType.id,
      ),
    )

    const organizationFieldTypes = commonFieldTypes.concat(uncommonFieldTypes)

    organizationFieldTypes.map((fieldType) => {
      ;(fieldType.fieldSettings = FieldSettingsFactory.getClass(
        fieldType.id,
        new FieldSettings(),
      )),
        (fieldType.values = [
          {
            id: randomUUID(),
            order: 0,
            json: ValueTypeFactory.getClass(fieldType.id, new ValueType()),
            // isHidden: false,
          },
        ])
    })

    // const fieldTypesDto: FieldType[] = []
    // const keys = ['id', 'type', 'name', 'description', 'isCommon']
    // organizationFieldTypes.map((fieldType) => {
    //   fieldTypesDto.push(
    //     Object.assign(
    //       defaults(
    //         pick(fieldType, keys),
    //         zipObject(keys, Array(keys.length).fill(null)),
    //       ),
    //       {
    //         fieldSettings: FieldSettingsFactory.getClass(
    //           fieldType.type,
    //           new FieldSettings(),
    //         ),
    //       },
    //     ) as FieldType,
    //   )
    // })

    return organizationFieldTypes
  }

  private async getListTypes(organizationId: string): Promise<ListType[]> {
    const commonListTypes = ListTypes.filter((listType) => listType.isCommon)

    const organization = await this.organizationModel.findByPk(organizationId, {
      include: [OrganizationListType],
    })

    const uncommonListTypes = ListTypes.filter((listType) =>
      organization?.organizationListTypes?.some(
        (item) => item.listTypeId === listType.id,
      ),
    )

    const organizationListTypes = commonListTypes.concat(uncommonListTypes)

    // const commonListTypes = await this.listTypeModel.findAll({
    //   where: { isCommon: true },
    // })
    // const organizationSpecificListTypes = await this.organizationModel.findByPk(
    //   organizationId,
    //   { include: [ListType] },
    // )

    // const organizationListTypes = commonListTypes.concat(
    //   organizationSpecificListTypes?.organizationListTypes as ListType[],
    // )

    // const listTypesDto: ListTypeDto[] = []
    // const keys = ['id', 'type', 'name', 'description', 'isCommon']
    // organizationListTypes.map((listType) => {
    //   listTypesDto.push(
    //     defaults(
    //       pick(listType, keys),
    //       zipObject(keys, Array(keys.length).fill(null)),
    //     ) as ListTypeDto,
    //   )
    // })

    return organizationListTypes
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
        certificationTypes: [],
        applicantTypes: [],
        sections: [],
        screens: [],
        fields: [],
      },
    ) as FormDto

    const certificationTypes: CertificationType[] = []

    const keys = ['id', 'type', 'name', 'description']
    form?.formCertificationTypes?.map((formCertification) => {
      CertificationTypes.map((certification) => {
        if (formCertification.certificationTypeId === certification.id) {
          certificationTypes.push(
            defaults(
              pick(
                { ...certification, formCertificationId: formCertification.id },
                keys,
              ),
              zipObject(keys, Array(keys.length).fill(null)),
            ) as CertificationType,
          )
        }
      })
    })

    formDto.certificationTypes = certificationTypes

    const applicantKeys = ['id', 'applicantTypeId', 'name']
    form.formApplicantTypes?.map((formApplicant) => {
      ApplicantTypes.map((applicant) => {
        if (formApplicant.applicantTypeId === applicant.id) {
          formDto.applicantTypes?.push(
            defaults(
              pick(
                { ...applicant, formApplicantId: formApplicant.id },
                applicantKeys,
              ),
              zipObject(applicantKeys, Array(applicantKeys.length).fill(null)),
            ) as ApplicantType,
          )
        }
      })
    })

    console.log(formDto.applicantTypes)

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
                fieldSettings: FieldSettingsFactory.getClass(
                  field.fieldType,
                  new FieldSettings(),
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
