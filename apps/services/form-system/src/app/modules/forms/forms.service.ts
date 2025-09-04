import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'

import { SectionTypes, UrlMethods } from '@island.is/form-system/shared'
import { ScreenDto } from '../screens/models/dto/screen.dto'
import { Screen } from '../screens/models/screen.model'
import { FieldDto } from '../fields/models/dto/field.dto'
import { Field } from '../fields/models/field.model'
import { Organization } from '../organizations/models/organization.model'
import { SectionDto } from '../sections/models/dto/section.dto'
import { Section } from '../sections/models/section.model'
import { FormDto } from './models/dto/form.dto'
import { FormResponseDto } from './models/dto/form.response.dto'
import { Form } from './models/form.model'
import { ListItem } from '../listItems/models/listItem.model'
import { UpdateFormDto } from './models/dto/updateForm.dto'
import {
  UpdateFormResponse,
  UpdateFormError,
} from '@island.is/form-system/shared'
import {
  CertificationType,
  CertificationTypes,
} from '../../dataTypes/certificationTypes/certificationType.model'
import { FormCertificationType } from '../formCertificationTypes/models/formCertificationType.model'
import {
  ApplicantType,
  ApplicantTypes,
} from '../../dataTypes/applicantTypes/applicantType.model'
import { FieldSettings } from '../../dataTypes/fieldSettings/fieldSettings.model'
import { FieldSettingsFactory } from '../../dataTypes/fieldSettings/fieldSettings.factory'
import {
  FieldType,
  FieldTypes,
} from '../../dataTypes/fieldTypes/fieldType.model'
import { ValueTypeFactory } from '../../dataTypes/valueTypes/valueType.factory'
import { ValueType } from '../../dataTypes/valueTypes/valueType.model'
import { randomUUID } from 'crypto'
import { ListType, ListTypes } from '../../dataTypes/listTypes/listType.model'
import { FormCertificationTypeDto } from '../formCertificationTypes/models/dto/formCertificationType.dto'
import { OrganizationUrlDto } from '../organizationUrls/models/dto/organizationUrl.dto'
import { OrganizationUrl } from '../organizationUrls/models/organizationUrl.model'
import { FormUrl } from '../formUrls/models/formUrl.model'
import { FormStatus } from '@island.is/form-system/shared'
import { Option } from '../../dataTypes/option.model'
import { Op, UniqueConstraintError } from 'sequelize'
import { v4 as uuidV4 } from 'uuid'
import { Sequelize } from 'sequelize-typescript'
import { User } from '@island.is/auth-nest-tools'
import { jwtDecode } from 'jwt-decode'
import { OrganizationPermission } from '../organizationPermissions/models/organizationPermission.model'
import { UrlTypes } from '@island.is/form-system/enums'

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Form)
    private readonly formModel: typeof Form,
    @InjectModel(Section)
    private readonly sectionModel: typeof Section,
    @InjectModel(Screen)
    private readonly screenModel: typeof Screen,
    @InjectModel(Field)
    private readonly fieldModel: typeof Field,
    @InjectModel(ListItem)
    private readonly listItemModel: typeof ListItem,
    @InjectModel(Organization)
    private readonly organizationModel: typeof Organization,
    @InjectModel(OrganizationUrl)
    private readonly organizationUrlModel: typeof OrganizationUrl,
    @InjectModel(FormCertificationType)
    private readonly formCertificationTypeModel: typeof FormCertificationType,
    @InjectModel(FormUrl)
    private readonly formUrlModel: typeof FormUrl,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(user: User, nationalId: string): Promise<FormResponseDto> {
    const token = jwtDecode<{ name: string; nationalId: string }>(
      user.authorization,
    )

    // the loader is not sending the nationalId
    if (nationalId === '0') {
      console.log('changing nationalId')
      nationalId = token.nationalId
    }

    let organization = await this.organizationModel.findOne({
      where: { nationalId: nationalId },
    })

    if (!organization) {
      organization = await this.organizationModel.create({
        nationalId: nationalId,
        name: { is: '', en: '' },
      } as Organization)
    }

    // If Admin is logged in for SÍ and chooses a different organization we don't want to change the name
    // if Admin is logged in then the token.nationalId is always the nationalId of the admin organization
    if (nationalId === token.nationalId) {
      organization.name = {
        is: token.name ?? 'unknown',
        en: organization.name.en,
      }
      await organization.save()
    }

    const forms = await this.formModel.findAll({
      where: { organizationId: organization.id },
    })

    const keys = [
      'id',
      'name',
      'slug',
      'organizationNationalId',
      'organizationDisplayName',
      'invalidationDate',
      'created',
      'modified',
      'isTranslated',
      'hasPayment',
      'beenPublished',
      'status',
      'applicationDaysToRemove',
      'stopProgressOnValidatingScreen',
      'hasSummaryScreen',
    ]

    const formResponseDto: FormResponseDto = {
      forms: forms.map((form) => {
        return defaults(
          pick(form, keys),
          zipObject(keys, Array(keys.length).fill(null)),
        ) as FormDto
      }),
      organizationNationalIds: await this.organizationModel
        .findAll({
          attributes: ['nationalId'],
        })
        .then((organizations) => organizations.map((org) => org.nationalId)),
      organizations: await this.organizationModel
        .findAll({
          attributes: ['nationalId', 'name'],
        })
        .then((organizations) =>
          organizations.map(
            (org) =>
              ({
                value: org.nationalId,
                label: org.name.is,
                isSelected: org.nationalId === nationalId,
              } as Option),
          ),
        ),
    }

    return formResponseDto
  }

  async findOne(id: string): Promise<FormResponseDto> {
    const form = await this.findById(id)

    if (!form) {
      throw new NotFoundException(`Form with id '${id}' not found`)
    }
    const formResponse = await this.buildFormResponse(form)

    if (!formResponse) {
      throw new Error('Error generating form response')
    }

    return formResponse
  }

  async create(
    user: User,
    organizationNationalId: string,
  ): Promise<FormResponseDto> {
    const organization = await this.organizationModel.findOne({
      where: { nationalId: organizationNationalId },
    })

    if (!organization) {
      throw new NotFoundException(
        `Organization with nationalId ${organizationNationalId} not found`,
      )
    }

    const newForm: Form = await this.formModel.create({
      organizationId: organization.id,
      organizationNationalId: organizationNationalId,
      status: FormStatus.IN_DEVELOPMENT,
    } as Form)

    await this.createFormTemplate(newForm)

    // We are fetching the form again to get the full object with all relations
    const form = await this.findById(newForm.id)

    if (!form) {
      throw new NotFoundException(`Form with id '${newForm.id}' not found`)
    }

    const formResponse = await this.buildFormResponse(form)

    if (!formResponse) {
      throw new Error('Error generating form response')
    }

    return formResponse
  }

  async changePublished(id: string): Promise<FormResponseDto> {
    const form = await this.formModel.findOne({
      where: { status: FormStatus.PUBLISHED_BEING_CHANGED, derivedFrom: id },
    })

    if (form) {
      throw new Error('Form is already being changed')
    }

    const newForm = await this.copyForm(id, true)

    const formResponse = await this.buildFormResponse(newForm)

    if (!formResponse) {
      throw new Error('Error generating form response.')
    }

    return formResponse
  }

  async publish(id: string, user: User): Promise<FormResponseDto> {
    const form = await this.formModel.findByPk(id)

    if (!form) {
      throw new NotFoundException(`Form with id '${id}' not found`)
    }

    const existingPublishedForm = await this.formModel.findOne({
      where: {
        slug: form.slug,
        status: FormStatus.PUBLISHED,
        id: { [Op.ne]: form.derivedFrom },
      },
    })

    if (existingPublishedForm) {
      throw new Error(
        `A published form with the slug '${form.slug}' already exists`,
      )
    }

    form.status = FormStatus.PUBLISHED
    form.beenPublished = true

    if (form.derivedFrom) {
      const derivedFromForm = await this.formModel.findByPk(form.derivedFrom)

      if (!derivedFromForm) {
        throw new NotFoundException(`Form with id '${id}' not found`)
      }

      derivedFromForm.status = FormStatus.UNPUBLISHED_BECAUSE_CHANGED

      await this.sequelize.transaction(async (transaction) => {
        await form.save({ transaction })
        await derivedFromForm.save({ transaction })
      })
    } else {
      await form.save()
    }

    return this.findAll(user, user.nationalId)
  }

  async update(
    id: string,
    updateFormDto: UpdateFormDto,
  ): Promise<UpdateFormResponse> {
    const form = await this.formModel.findByPk(id)

    if (!form) {
      throw new NotFoundException(`Form with id '${id}' not found`)
    }

    Object.assign(form, updateFormDto)

    const response = new UpdateFormResponse()

    try {
      await form.save()
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        response.updateSuccess = false
        response.errors = error.errors.map(
          (err) =>
            ({
              field: err.path,
              message: err.message,
            } as UpdateFormError),
        )
      } else {
        throw error
      }
    }

    return response
  }

  async delete(id: string): Promise<void> {
    const form = await this.formModel.findByPk(id)

    if (!form) {
      throw new NotFoundException(`Form with id '${id}' not found.`)
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
          model: FormUrl,
          as: 'formUrls',
        },
      ],
      order: [
        [{ model: Section, as: 'sections' }, 'displayOrder', 'ASC'],
        [
          { model: Section, as: 'sections' },
          { model: Screen, as: 'screens' },
          'displayOrder',
          'ASC',
        ],
        [
          { model: Section, as: 'sections' },
          { model: Screen, as: 'screens' },
          { model: Field, as: 'fields' },
          'displayOrder',
          'ASC',
        ],
        [
          { model: Section, as: 'sections' },
          { model: Screen, as: 'screens' },
          { model: Field, as: 'fields' },
          { model: ListItem, as: 'list' },
          'displayOrder',
          'ASC',
        ],
      ],
    })

    if (!form) {
      throw new NotFoundException(`Form with id '${id}' not found`)
    }

    return form
  }

  private async buildFormResponse(form: Form): Promise<FormResponseDto> {
    const response: FormResponseDto = {
      form: await this.setArrays(form),
      fieldTypes: await this.getFieldTypes(form.organizationId),
      certificationTypes: await this.getCertificationTypes(form.organizationId),
      applicantTypes: await this.getApplicantTypes(),
      listTypes: await this.getListTypes(form.organizationId),
      submitUrls: await this.getUrls(form.organizationId, UrlTypes.SUBMIT),
      validationUrls: await this.getUrls(
        form.organizationId,
        UrlTypes.VALIDATION,
      ),
    }

    return response
  }

  private async getUrls(
    organizationId: string,
    type: string,
  ): Promise<OrganizationUrlDto[]> {
    const organizationUrls = await this.organizationUrlModel.findAll({
      where: { organizationId: organizationId, type: type },
    })

    const keys = ['id', 'url', 'isXroad', 'isTest', 'type', 'method']

    const organizationUrlsDto: OrganizationUrlDto[] = []

    organizationUrls.map((organizationUrl) => {
      organizationUrlsDto.push(
        defaults(
          pick(organizationUrl, keys),
          zipObject(keys, Array(keys.length).fill(null)) as OrganizationUrlDto,
        ),
      )
    })

    return organizationUrlsDto
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
      include: [OrganizationPermission],
    })

    const uncommonCertificationTypes = CertificationTypes.filter(
      (certificationType) =>
        organization?.organizationPermissions?.some(
          (item) => item.permission === certificationType.id,
        ),
    )

    const organizationCertificationTypes = commonCertificationTypes.concat(
      uncommonCertificationTypes,
    )

    return organizationCertificationTypes
  }

  private async getFieldTypes(organizationId: string): Promise<FieldType[]> {
    const commonFieldTypes = FieldTypes.filter(
      (fieldType) => fieldType.isCommon,
    )

    const organization = await this.organizationModel.findByPk(organizationId, {
      include: [OrganizationPermission],
    })

    const uncommonFieldTypes = FieldTypes.filter((fieldType) =>
      organization?.organizationPermissions?.some(
        (item) => item.permission === fieldType.id,
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
            events: [],
          },
        ])
    })

    return organizationFieldTypes
  }

  private async getListTypes(organizationId: string): Promise<ListType[]> {
    const commonListTypes = ListTypes.filter((listType) => listType.isCommon)

    const organization = await this.organizationModel.findByPk(organizationId, {
      include: [OrganizationPermission],
    })

    const uncommonListTypes = ListTypes.filter((listType) =>
      organization?.organizationPermissions?.some(
        (item) => item.permission === listType.id,
      ),
    )

    const organizationListTypes = commonListTypes.concat(uncommonListTypes)

    return organizationListTypes
  }

  private async isZendeskEnabled(
    organizationId: string,
    formUrls: FormUrl[],
  ): Promise<boolean> {
    const organizationUrls = await this.organizationUrlModel.findAll({
      where: { organizationId: organizationId },
    })

    return formUrls.some((formUrl) =>
      organizationUrls.some(
        (orgUrl) =>
          orgUrl.id === formUrl.organizationUrlId &&
          orgUrl.method === UrlMethods.SEND_TO_ZENDESK,
      ),
    )
  }

  private async setArrays(form: Form): Promise<FormDto> {
    const isZendesk = await this.isZendeskEnabled(
      form.organizationId,
      form.formUrls ?? [],
    )

    const formKeys = [
      'id',
      'organizationId',
      'organizationNationalId',
      'organizationDisplayName',
      'name',
      'slug',
      'invalidationDate',
      'created',
      'modified',
      'isTranslated',
      'hasPayment',
      'beenPublished',
      'status',
      'applicationDaysToRemove',
      'stopProgressOnValidatingScreen',
      'hasSummaryScreen',
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
        urls: [],
        sections: [],
        screens: [],
        fields: [],
        isZendeskEnabled: isZendesk,
      },
    ) as FormDto

    const certificationKeys = ['id', 'certificationTypeId']
    form.formCertificationTypes?.map((formCertification) => {
      formDto.certificationTypes?.push(
        defaults(
          pick(formCertification, certificationKeys),
          zipObject(
            certificationKeys,
            Array(certificationKeys.length).fill(null),
          ),
        ) as FormCertificationTypeDto,
      )
    })

    form.formUrls?.map((formUrl) => {
      formDto.urls?.push(formUrl.organizationUrlId)
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
      'list',
      'isRequired',
      'fieldSettings',
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
                  field.fieldSettings,
                ),
              },
            ) as FieldDto,
          )
        })
      })
    })

    return formDto
  }

  private async createFormTemplate(form: Form): Promise<void> {
    await this.sectionModel.bulkCreate([
      {
        formId: form.id,
        sectionType: SectionTypes.PREMISES,
        displayOrder: 0,
        name: { is: 'Forsendur', en: 'Premises' },
      } as Section,
      {
        formId: form.id,
        sectionType: SectionTypes.PARTIES,
        displayOrder: 1,
        name: { is: 'Hlutaðeigandi aðilar', en: 'Relevant parties' },
      } as Section,
      {
        formId: form.id,
        sectionType: SectionTypes.SUMMARY,
        displayOrder: 9911,
        name: { is: 'Yfirlit', en: 'Summary' },
      } as Section,

      {
        formId: form.id,
        sectionType: SectionTypes.COMPLETED,
        displayOrder: 9931,
        name: { is: 'Staðfesting', en: 'Confirmation' },
      } as Section,
    ])

    const paymentSection = await this.sectionModel.create({
      formId: form.id,
      sectionType: SectionTypes.PAYMENT,
      displayOrder: 9921,
      name: { is: 'Greiðsla', en: 'Payment' },
    } as Section)

    await this.screenModel.create({
      sectionId: paymentSection.id,
      displayOrder: 0,
      name: { is: 'Greiðslusíða', en: 'Payment screen' },
    } as Screen)

    const inputSection = await this.sectionModel.create({
      formId: form.id,
      sectionType: SectionTypes.INPUT,
      displayOrder: 2,
      name: { is: 'Kafli', en: 'Section' },
    } as Section)

    await this.screenModel.create({
      sectionId: inputSection.id,
      displayOrder: 0,
      name: { is: 'innsláttarsíða 1', en: 'Input screen 1' },
    } as Screen)
  }

  private async copyForm(id: string, isDerived: boolean): Promise<Form> {
    const existingForm = await this.findById(id)

    if (!existingForm) {
      throw new NotFoundException(`Form with id '${id}' not found`)
    }

    if (existingForm.status === FormStatus.PUBLISHED_BEING_CHANGED) {
      throw new Error(
        `Cannot change form that is in status ${FormStatus.PUBLISHED_BEING_CHANGED}`,
      )
    }

    const newForm = existingForm.toJSON()
    newForm.id = uuidV4()
    newForm.status = isDerived
      ? FormStatus.PUBLISHED_BEING_CHANGED
      : FormStatus.IN_DEVELOPMENT
    newForm.created = new Date()
    newForm.modified = new Date()
    newForm.derivedFrom = isDerived ? existingForm.id : ''
    newForm.identifier = isDerived ? existingForm.identifier : uuidV4()
    newForm.beenPublished = false

    const sections: Section[] = []
    const screens: Screen[] = []
    const fields: Field[] = []
    const listItems: ListItem[] = []
    const formCertificationTypes: FormCertificationType[] = []
    const formUrls: FormUrl[] = []

    for (const section of existingForm.sections) {
      const newSection = section.toJSON()
      newSection.id = uuidV4()
      newSection.formId = newForm.id
      newSection.created = new Date()
      newSection.modified = new Date()
      sections.push(newSection)
      for (const screen of section.screens) {
        const newScreen = screen.toJSON()
        newScreen.id = uuidV4()
        newScreen.sectionId = newSection.id
        newScreen.created = new Date()
        newScreen.modified = new Date()
        screens.push(newScreen)
        for (const field of screen.fields) {
          const newField = field.toJSON()
          newField.id = uuidV4()
          newField.screenId = newScreen.id
          newField.identifier = isDerived ? field.identifier : uuidV4()
          newField.created = new Date()
          newField.modified = new Date()
          fields.push(newField)
          if (field.list) {
            for (const listItem of field.list) {
              const newListItem = listItem.toJSON()
              newListItem.id = uuidV4()
              newListItem.fieldId = newField.id
              newListItem.created = new Date()
              newListItem.modified = new Date()
              listItems.push(newListItem)
            }
          }
        }
      }
    }

    const hasCompleted = sections.some(
      (s) => s.sectionType === SectionTypes.COMPLETED,
    )
    if (!hasCompleted) {
      const maxOrder =
        sections.length > 0
          ? Math.max(...sections.map((s) => s.displayOrder ?? 0))
          : 0
      sections.push({
        id: uuidV4(),
        formId: newForm.id,
        sectionType: SectionTypes.COMPLETED,
        displayOrder: maxOrder + 1,
        name: { is: 'Staðfesting', en: 'Confirmation' },
        created: new Date(),
        modified: new Date(),
      } as Section)
    }

    if (existingForm.formCertificationTypes) {
      for (const certificationType of existingForm.formCertificationTypes) {
        const newFormCertificationType = certificationType.toJSON()
        newFormCertificationType.id = uuidV4()
        newFormCertificationType.formId = newForm.id
        newFormCertificationType.created = new Date()
        newFormCertificationType.modified = new Date()
        formCertificationTypes.push(newFormCertificationType)
      }
    }

    if (existingForm.formUrls) {
      for (const formUrl of existingForm.formUrls) {
        const newFormUrl = formUrl.toJSON()
        newFormUrl.id = uuidV4()
        newFormUrl.formId = newForm.id
        newFormUrl.created = new Date()
        newFormUrl.modified = new Date()
        formUrls.push(newFormUrl)
      }
    }

    await this.sequelize.transaction(async (transaction) => {
      await this.formModel.create(newForm, { transaction })
      await this.sectionModel.bulkCreate(sections, { transaction })
      await this.screenModel.bulkCreate(screens, { transaction })
      await this.fieldModel.bulkCreate(fields, { transaction })
      await this.listItemModel.bulkCreate(listItems, { transaction })
      await this.formCertificationTypeModel.bulkCreate(formCertificationTypes, {
        transaction,
      })
      await this.formUrlModel.bulkCreate(formUrls, { transaction })
    })

    return newForm
  }
}
