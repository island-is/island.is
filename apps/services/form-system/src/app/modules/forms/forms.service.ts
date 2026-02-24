import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import defaults from 'lodash/defaults'
import pick from 'lodash/pick'
import zipObject from 'lodash/zipObject'

import { User } from '@island.is/auth-nest-tools'
import {
  FieldTypesEnum,
  FormStatus,
  SectionTypes,
  UpdateFormError,
  UpdateFormResponse,
  UpdateFormStatusDto,
} from '@island.is/form-system/shared'
import { randomUUID } from 'crypto'
import { Op, UniqueConstraintError } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuidV4 } from 'uuid'
import {
  ApplicantType,
  ApplicantTypes,
} from '../../dataTypes/applicantTypes/applicantType.model'
import {
  CertificationType,
  CertificationTypes,
} from '../../dataTypes/certificationTypes/certificationType.model'
import { CompletedSectionInfo } from '../../dataTypes/completedSectionInfo.model'
import { FieldSettingsFactory } from '../../dataTypes/fieldSettings/fieldSettings.factory'
import { FieldSettings } from '../../dataTypes/fieldSettings/fieldSettings.model'
import {
  FieldType,
  FieldTypes,
} from '../../dataTypes/fieldTypes/fieldType.model'
import { ListType, ListTypes } from '../../dataTypes/listTypes/listType.model'
import { Option } from '../../dataTypes/option.model'
import { ValueTypeFactory } from '../../dataTypes/valueTypes/valueType.factory'
import { ValueType } from '../../dataTypes/valueTypes/valueType.model'
import { Application } from '../applications/models/application.model'
import { FieldDto } from '../fields/models/dto/field.dto'
import { Field } from '../fields/models/field.model'
import { FormCertificationTypeDto } from '../formCertificationTypes/models/dto/formCertificationType.dto'
import { FormCertificationType } from '../formCertificationTypes/models/formCertificationType.model'
import { ListItem } from '../listItems/models/listItem.model'
import { OrganizationPermission } from '../organizationPermissions/models/organizationPermission.model'
import { Organization } from '../organizations/models/organization.model'
import { ScreenDto } from '../screens/models/dto/screen.dto'
import { Screen } from '../screens/models/screen.model'
import { SectionDto } from '../sections/models/dto/section.dto'
import { Section } from '../sections/models/section.model'
import { FormDto } from './models/dto/form.dto'
import { FormResponseDto } from './models/dto/form.response.dto'
import { UpdateFormDto } from './models/dto/updateForm.dto'
import { Form } from './models/form.model'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { Dependency } from '../../dataTypes/dependency.model'
import { AdminPortalScope } from '@island.is/auth/scopes'

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Form)
    private readonly formModel: typeof Form,
    @InjectModel(Application)
    private readonly applicationModel: typeof Application,
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
    @InjectModel(FormCertificationType)
    private readonly formCertificationTypeModel: typeof FormCertificationType,
    private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async findAll(user: User, nationalId: string): Promise<FormResponseDto> {
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)

    if (user.nationalId !== nationalId && !isAdmin) {
      throw new UnauthorizedException(
        `User does not have permission to get forms for organization with nationalId '${nationalId}'`,
      )
    }

    // the loader is not sending the nationalId
    if (nationalId === '0') {
      nationalId = user.nationalId
    }

    let organization = await this.organizationModel.findOne({
      where: { nationalId: nationalId },
    })

    if (!organization) {
      organization = await this.organizationModel.create({
        nationalId: nationalId,
      } as Organization)
    }

    const forms = await this.formModel.findAll({
      where: {
        organizationId: organization.id,
        status: { [Op.ne]: FormStatus.ARCHIVED },
      },
      order: [['modified', 'DESC']],
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
      'zendeskInternal',
      'useValidate',
      'usePopulate',
      'submissionServiceUrl',
      'isTranslated',
      'hasPayment',
      'beenPublished',
      'status',
      'daysUntilApplicationPrune',
      'allowProceedOnValidationFail',
      'hasSummaryScreen',
      'completedSectionInfo',
    ]

    const formResponseDto: FormResponseDto = {
      forms: forms.map((form) => {
        const dto = defaults(
          pick(form, keys),
          zipObject(keys, Array(keys.length).fill(null)),
        ) as FormDto

        if (dto.completedSectionInfo) {
          const cs = dto.completedSectionInfo

          cs.title ??= { is: '', en: '' }
          cs.confirmationHeader ??= { is: '', en: '' }
          cs.confirmationText ??= { is: '', en: '' }

          cs.additionalInfo ??= []
        }

        return dto
      }),
      organizationNationalIds: await this.organizationModel
        .findAll({
          attributes: ['nationalId'],
        })
        .then((organizations) => organizations.map((org) => org.nationalId)),
      organizations: await this.organizationModel
        .findAll({
          attributes: ['nationalId'],
        })
        .then((organizations) =>
          organizations.map(
            (org) =>
              ({
                value: org.nationalId,
                label: '',
                isSelected: org.nationalId === nationalId,
              } as Option),
          ),
        ),
    }

    return formResponseDto
  }

  async findOne(user: User, id: string): Promise<FormResponseDto> {
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)

    const form = await this.findById(id)

    if (!form) {
      throw new NotFoundException(`Form with id '${id}' not found`)
    }

    const formOwnerNationalId = form.organizationNationalId

    if (user.nationalId !== formOwnerNationalId && !isAdmin) {
      throw new UnauthorizedException(
        `User does not have permission to get form for organization with nationalId '${formOwnerNationalId}'`,
      )
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
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)

    if (user.nationalId !== organizationNationalId && !isAdmin) {
      throw new UnauthorizedException(
        `User does not have permission to create form for organization with nationalId '${organizationNationalId}'`,
      )
    }

    const organization = await this.organizationModel.findOne({
      where: { nationalId: organizationNationalId },
    })

    if (!organization) {
      throw new NotFoundException(
        `Organization with nationalId ${organizationNationalId} not found`,
      )
    }

    const completedSectionInfo = {
      title: { is: '', en: '' },
      confirmationHeader: { is: '', en: '' },
      confirmationText: { is: '', en: '' },
      additionalInfo: [],
    } as CompletedSectionInfo

    const newForm = await this.formModel.create({
      organizationId: organization.id,
      organizationNationalId: organizationNationalId,
      status: FormStatus.IN_DEVELOPMENT,
      draftTotalSteps: 3,
      completedSectionInfo,
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

  async update(
    user: User,
    id: string,
    updateFormDto: UpdateFormDto,
  ): Promise<UpdateFormResponse> {
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)

    const form = await this.formModel.findByPk(id)

    if (!form) {
      throw new NotFoundException(`Form with id '${id}' not found`)
    }

    const formOwnerNationalId = form.organizationNationalId

    if (user.nationalId !== formOwnerNationalId && !isAdmin) {
      throw new UnauthorizedException(
        `User does not have permission to update form with id '${id}'`,
      )
    }

    const originalHasPayment = form.hasPayment
    const originalHasSummary = form.hasSummaryScreen

    Object.assign(form, updateFormDto)

    if (originalHasPayment !== form.hasPayment) {
      if (originalHasPayment) {
        form.draftTotalSteps--
      } else {
        form.draftTotalSteps++
      }
    }

    if (originalHasSummary !== form.hasSummaryScreen) {
      if (originalHasSummary) {
        form.draftTotalSteps--
      } else {
        form.draftTotalSteps++
      }
    }

    const response = new UpdateFormResponse()

    try {
      await form.save()
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        const slug = updateFormDto.slug
        response.updateSuccess = false
        response.errors = [
          {
            field: 'slug',
            message: `slug '${slug}' er þegar í notkun. Vinsamlegast veldu annað slug.`,
          } as UpdateFormError,
        ]
      } else {
        throw error
      }
    }

    return response
  }

  async copy(user: User, id: string): Promise<FormResponseDto> {
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)

    const form = await this.findById(id)

    if (!form) {
      throw new NotFoundException(`Form with id '${id}' not found`)
    }

    const formOwnerNationalId = form.organizationNationalId

    if (user.nationalId !== formOwnerNationalId && !isAdmin) {
      throw new UnauthorizedException(
        `User does not have permission to copy form with id '${id}'`,
      )
    }

    const copyForm = await this.copyForm(id, false, `${form.slug}-afrit`)
    const formResponse = await this.buildFormResponse(copyForm)

    if (!formResponse) {
      throw new Error('Error generating form response')
    }

    return formResponse
  }

  async updateStatus(
    user: User,
    id: string,
    updateFormStatusDto: UpdateFormStatusDto,
  ): Promise<FormResponseDto> {
    const isAdmin = user.scope.includes(AdminPortalScope.formSystemAdmin)

    const form = await this.formModel.findByPk(id)

    if (!form) {
      throw new NotFoundException(`Form with id '${id}' not found`)
    }

    const formOwnerNationalId = form.organizationNationalId

    if (user.nationalId !== formOwnerNationalId && !isAdmin) {
      throw new UnauthorizedException(
        `User does not have permission to update status of form with id '${id}'`,
      )
    }

    const { newStatus } = updateFormStatusDto
    const currentStatus = form.status

    switch (currentStatus) {
      case FormStatus.IN_DEVELOPMENT:
        if (newStatus === FormStatus.PUBLISHED) {
          return await this.publishFormInDevelopment(id, form)
        } else if (newStatus === FormStatus.ARCHIVED) {
          return await this.deleteForm(id, form)
        } else if (newStatus === FormStatus.IN_DEVELOPMENT) {
          return await this.deleteApplications(id)
        }
        break
      case FormStatus.PUBLISHED:
        if (newStatus === FormStatus.ARCHIVED) {
          return await this.archiveForm(id, form)
        } else if (newStatus === FormStatus.PUBLISHED_BEING_CHANGED) {
          return await this.changePublishedForm(id, form)
        }
        break
      case FormStatus.PUBLISHED_BEING_CHANGED:
        if (newStatus === FormStatus.PUBLISHED) {
          return await this.publishFormBeingChanged(id, form)
        } else if (newStatus === FormStatus.ARCHIVED) {
          return await this.deleteForm(id, form)
        } else if (newStatus === FormStatus.PUBLISHED_BEING_CHANGED) {
          return await this.deleteApplications(id)
        }
        break
    }
    throw new BadRequestException(
      `Invalid status transition from '${currentStatus}' to '${newStatus}'`,
    )
  }

  private async publishFormInDevelopment(
    id: string,
    form: Form,
  ): Promise<FormResponseDto> {
    await this.sequelize.transaction(async (transaction) => {
      try {
        await this.applicationModel.destroy({
          where: { formId: id },
          transaction,
        })

        form.status = FormStatus.PUBLISHED
        form.beenPublished = true
        await form.save({ transaction })
      } catch (error) {
        throw new InternalServerErrorException(
          `Unexpected error publishing form '${id}'.`,
        )
      }
    })

    return new FormResponseDto()
  }

  private async archiveForm(id: string, form: Form): Promise<FormResponseDto> {
    const slug = form.slug
    form.status = FormStatus.ARCHIVED
    form.slug = `${form.slug}-archived-${Date.now()}`
    await form.save()

    const copyForm = await this.copyForm(id, false, slug)
    const formResponse = await this.buildFormResponse(copyForm)

    if (!formResponse) {
      throw new Error('Error generating form response')
    }

    return formResponse
  }

  private async publishFormBeingChanged(
    id: string,
    formToBePublished: Form,
  ): Promise<FormResponseDto> {
    const derivedFromId = formToBePublished.derivedFrom
    if (!derivedFromId) {
      throw new BadRequestException(
        `derivedFromId not found on form with id '${id}'`,
      )
    }

    const formToBeArchived = await this.formModel.findByPk(derivedFromId)
    if (!formToBeArchived) {
      throw new NotFoundException(`Form with id '${derivedFromId}' not found`)
    }

    await this.sequelize.transaction(async (transaction) => {
      try {
        await this.applicationModel.destroy({
          where: { formId: id },
          transaction,
        })

        const slugToBeArchived = formToBeArchived.slug
        formToBeArchived.status = FormStatus.ARCHIVED
        formToBeArchived.slug = `${
          formToBeArchived.slug
        }-archived-${Date.now()}`
        await formToBeArchived.save({ transaction })

        formToBePublished.slug =
          formToBePublished.slug === `${slugToBeArchived}-i-breytingu`
            ? slugToBeArchived
            : formToBePublished.slug
        formToBePublished.status = FormStatus.PUBLISHED
        await formToBePublished.save({ transaction })
      } catch (error) {
        throw new InternalServerErrorException(
          `Unexpected error publishing form '${id}'.`,
        )
      }
    })

    const formResponse = await this.buildFormResponse(formToBeArchived)

    if (!formResponse) {
      throw new Error('Error generating form response')
    }

    return formResponse
  }

  private async changePublishedForm(
    id: string,
    form: Form,
  ): Promise<FormResponseDto> {
    const copyForm = await this.copyForm(id, true, `${form.slug}-i-breytingu`)
    const formResponse = await this.buildFormResponse(copyForm)

    if (!formResponse) {
      throw new Error('Error generating form response')
    }

    return formResponse
  }

  private async deleteForm(id: string, form: Form): Promise<FormResponseDto> {
    const hasLiveApplications =
      form.beenPublished &&
      (await this.applicationModel.count({
        where: { formId: id, isTest: false },
      })) > 0

    if (hasLiveApplications) {
      throw new ConflictException(
        `Form '${id}' cannot be deleted because it has been published and has applications tied to it.`,
      )
    }

    try {
      await form.destroy()
    } catch (error) {
      throw new InternalServerErrorException(
        `Unexpected error deleting form '${id}'.`,
      )
    }

    return new FormResponseDto()
  }

  private async deleteApplications(id: string): Promise<FormResponseDto> {
    try {
      await this.applicationModel.destroy({
        where: { formId: id, isTest: true },
      })
    } catch (error) {
      throw new InternalServerErrorException(
        `Unexpected error deleting applications for form '${id}'.`,
      )
    }

    return new FormResponseDto()
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
      submissionUrls: await this.getSubmissionUrls(form.organizationId),
    }

    if (form.completedSectionInfo) {
      const cs = form.completedSectionInfo
      cs.title ??= { is: '', en: '' }
      cs.confirmationHeader ??= { is: '', en: '' }
      cs.confirmationText ??= { is: '', en: '' }
      cs.additionalInfo ??= []
    }

    return response
  }

  private async getSubmissionUrls(organizationId: string): Promise<string[]> {
    const forms = await this.formModel.findAll({
      attributes: ['submissionServiceUrl'],
      where: { organizationId },
    })

    const urls = forms
      .map((f) => f.submissionServiceUrl ?? '')
      .map((u) => u.trim())
      .filter((u) => u.length > 0 && u !== 'zendesk')

    // Return unique values preserving insertion order
    return Array.from(new Set(urls))
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

  private async setArrays(form: Form): Promise<FormDto> {
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
      'daysUntilApplicationPrune',
      'allowProceedOnValidationFail',
      'zendeskInternal',
      'useValidate',
      'usePopulate',
      'submissionServiceUrl',
      'hasSummaryScreen',
      'completedSectionInfo',
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
      'identifier',
      'sectionId',
      'name',
      'created',
      'modified',
      'displayOrder',
      'isHidden',
      'multiset',
      'shouldValidate',
      'shouldPopulate',
    ]
    const fieldKeys = [
      'id',
      'identifier',
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
    form.sections?.map((section) => {
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

    const inputScreen = await this.screenModel.create({
      sectionId: inputSection.id,
      displayOrder: 0,
      name: { is: 'Innsláttarskjár', en: 'Input screen' },
    } as Screen)

    await this.fieldModel.create({
      screenId: inputScreen.id,
      fieldType: FieldTypesEnum.TEXTBOX,
      displayOrder: 0,
      name: { is: 'Textainnsláttur', en: 'Text input' },
    } as Field)
  }

  private async updateDependencies(
    oldId: string,
    newId: string,
    deps: Dependency[],
  ): Promise<Dependency[]> {
    if (!deps || deps.length === 0) return []
    for (const dep of deps) {
      if (dep.parentProp === oldId) {
        dep.parentProp = newId
      }
      dep.childProps = dep.childProps.map((s) => s.replaceAll(oldId, newId))
    }
    return deps
  }

  private async copyForm(
    id: string,
    isDerived: boolean,
    slug: string,
  ): Promise<Form> {
    const existingForm = await this.findById(id)
    if (!existingForm) {
      throw new NotFoundException(`Form with id '${id}' not found`)
    }

    if (existingForm.status === FormStatus.PUBLISHED_BEING_CHANGED) {
      throw new Error(
        `Cannot copy form that is in status ${FormStatus.PUBLISHED_BEING_CHANGED}`,
      )
    }

    let deps = existingForm.dependencies || []

    const newForm = existingForm.toJSON()
    newForm.id = uuidV4()
    newForm.status = isDerived
      ? FormStatus.PUBLISHED_BEING_CHANGED
      : FormStatus.IN_DEVELOPMENT
    newForm.slug = slug
    newForm.created = new Date()
    newForm.modified = new Date()
    newForm.derivedFrom = isDerived ? existingForm.id : null
    newForm.identifier = isDerived ? existingForm.identifier : uuidV4()
    newForm.beenPublished = false
    newForm.completedSectionInfo = existingForm.completedSectionInfo

    const sections: Section[] = []
    const screens: Screen[] = []
    const fields: Field[] = []
    const listItems: ListItem[] = []
    const formCertificationTypes: FormCertificationType[] = []

    for (const section of existingForm.sections) {
      const newSection = section.toJSON()
      newSection.id = uuidV4()
      newSection.identifier = section.identifier
      newSection.formId = newForm.id
      newSection.created = new Date()
      newSection.modified = new Date()
      deps = await this.updateDependencies(section.id, newSection.id, deps)
      sections.push(newSection)
      for (const screen of section.screens) {
        const newScreen = screen.toJSON()
        newScreen.id = uuidV4()
        newScreen.identifier = screen.identifier
        newScreen.sectionId = newSection.id
        newScreen.created = new Date()
        newScreen.modified = new Date()
        deps = await this.updateDependencies(screen.id, newScreen.id, deps)
        screens.push(newScreen)
        for (const field of screen.fields) {
          const newField = field.toJSON()
          newField.id = uuidV4()
          newField.identifier = field.identifier
          newField.screenId = newScreen.id
          newField.created = new Date()
          newField.modified = new Date()
          fields.push(newField)
          deps = await this.updateDependencies(field.id, newField.id, deps)
          if (field.list) {
            for (const listItem of field.list) {
              const newListItem = listItem.toJSON()
              newListItem.id = uuidV4()
              newListItem.identifier = listItem.identifier
              newListItem.fieldId = newField.id
              newListItem.created = new Date()
              newListItem.modified = new Date()
              deps = await this.updateDependencies(
                listItem.id,
                newListItem.id,
                deps,
              )
              listItems.push(newListItem)
            }
          }
        }
      }
    }
    newForm.dependencies = deps

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

    try {
      await this.sequelize.transaction(async (transaction) => {
        await this.formModel.create(newForm, { transaction })
        await this.sectionModel.bulkCreate(sections, { transaction })
        await this.screenModel.bulkCreate(screens, { transaction })
        await this.fieldModel.bulkCreate(fields, { transaction })
        await this.listItemModel.bulkCreate(listItems, { transaction })
        await this.formCertificationTypeModel.bulkCreate(
          formCertificationTypes,
          {
            transaction,
          },
        )
      })
    } catch (error) {
      this.logger.error(`Failed to copy form '${id}'`, error)
      throw new InternalServerErrorException(
        `Unexpected error copying form '${id}'`,
      )
    }

    return newForm
  }
}
