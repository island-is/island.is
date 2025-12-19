import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { Op } from 'sequelize'
import { Application } from './models/application.model'
import { ApplicationDto } from './models/dto/application.dto'
import { Form } from '../forms/models/form.model'
import { Section } from '../sections/models/section.model'
import { ListItem } from '../listItems/models/listItem.model'
import { Field } from '../fields/models/field.model'
import { Screen } from '../screens/models/screen.model'
import { ApplicationMapper } from './models/application.mapper'
import { Value } from './models/value.model'
import { ValueTypeFactory } from '../../dataTypes/valueTypes/valueType.factory'
import { ValueType } from '../../dataTypes/valueTypes/valueType.model'
import { CreateApplicationDto } from './models/dto/createApplication.dto'
import { UpdateApplicationDto } from './models/dto/updateApplication.dto'
import {
  ApplicationStatus,
  ApplicationEvents,
  FieldTypesEnum,
  ApplicantTypesEnum,
} from '@island.is/form-system/shared'
import { Organization } from '../organizations/models/organization.model'
import { ServiceManager } from '../services/service.manager'
import { ApplicationEvent } from './models/applicationEvent.model'
import { ApplicationResponseDto } from './models/dto/application.response.dto'
import { ScreenValidationResponse } from '../../dataTypes/validationResponse.model'
import { User } from '@island.is/auth-nest-tools'
import { FormCertificationType } from '../formCertificationTypes/models/formCertificationType.model'
import { SubmitScreenDto } from './models/dto/submitScreen.dto'
import { ScreenDto } from '../screens/models/dto/screen.dto'
import { Option } from '../../dataTypes/option.model'
import { FormStatus } from '@island.is/form-system/shared'
import { MyPagesApplicationResponseDto } from './models/dto/myPagesApplication.response.dto'
import { Dependency } from '../../dataTypes/dependency.model'
import { SectionTypes } from '@island.is/form-system/shared'
import { getOrganizationInfoByNationalId } from '../../../utils/organizationInfo'
import { AuthDelegationType } from '@island.is/shared/types'
import * as kennitala from 'kennitala'
import type { Locale } from '@island.is/shared/types'
import { calculatePruneAt } from '../../../utils/calculatePruneAt'

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application)
    private readonly applicationModel: typeof Application,
    @InjectModel(Value)
    private readonly valueModel: typeof Value,
    @InjectModel(Form)
    private readonly formModel: typeof Form,
    @InjectModel(Organization)
    private readonly organizationModel: typeof Organization,
    @InjectModel(ApplicationEvent)
    private readonly applicationEventModel: typeof ApplicationEvent,
    private readonly applicationMapper: ApplicationMapper,
    private readonly serviceManager: ServiceManager,
    private readonly sequelize: Sequelize,
    @InjectModel(Screen) private screenModel: typeof Screen,
    @InjectModel(Field) private fieldModel: typeof Field,
    @InjectModel(Section) private sectionModel: typeof Section,
  ) {}

  async create(
    slug: string,
    createApplicationDto: CreateApplicationDto,
    user: User,
  ): Promise<ApplicationResponseDto> {
    const form: Form = await this.getForm(slug)

    if (!form) {
      throw new NotFoundException(`Form with slug '${slug}' not found`)
    }

    const allowedLoginTypes = await this.getAllowedLoginTypes(form)

    const loginTypes = await this.getLoginTypes(user)
    if (!this.isLoginAllowed(loginTypes, allowedLoginTypes)) {
      const responseDto = new ApplicationResponseDto()
      responseDto.isLoginTypeAllowed = false
      return responseDto
    }

    let newApplicationId = ''

    const isTest = form.status !== FormStatus.PUBLISHED

    const nationalId = user.actor?.nationalId || user.nationalId

    await this.sequelize.transaction(async (transaction) => {
      const newApplication: Application = await this.applicationModel.create(
        {
          formId: form.id,
          organizationId: form.organizationId,
          isTest: isTest,
          dependencies: form.dependencies,
          status: ApplicationStatus.DRAFT,
          nationalId,
          draftTotalSteps: form.draftTotalSteps,
          pruneAt: calculatePruneAt(form.daysUntilApplicationPrune),
        } as Application,
        { transaction },
      )

      await this.applicationEventModel.create(
        {
          applicationId: newApplication.id,
          eventType: ApplicationEvents.APPLICATION_CREATED,
          eventMessage: { is: 'Umsókn hafin', en: 'Application created' },
        } as ApplicationEvent,
        { transaction },
      )

      await Promise.all(
        form.sections.map((section) =>
          Promise.all(
            section.screens?.map((screen) =>
              Promise.all(
                screen.fields?.map(async (field) => {
                  if (
                    field.fieldType === FieldTypesEnum.APPLICANT &&
                    field.fieldSettings?.applicantType &&
                    !loginTypes.includes(field.fieldSettings.applicantType)
                  ) {
                    return
                  }
                  const valueJson =
                    ValueTypeFactory.getClass(
                      field.fieldType,
                      new ValueType(),
                    ) ?? {}
                  if (field.fieldType === FieldTypesEnum.APPLICANT) {
                    const type = field.fieldSettings?.applicantType
                    if (type === ApplicantTypesEnum.INDIVIDUAL) {
                      valueJson['nationalId'] = nationalId
                      valueJson['isLoggedInUser'] = true
                      valueJson['applicantType'] = type
                    } else if (
                      type ===
                        ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_INDIVIDUAL ||
                      type ===
                        ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_LEGAL_ENTITY ||
                      type === ApplicantTypesEnum.INDIVIDUAL_WITH_PROCURATION
                    ) {
                      valueJson['nationalId'] = user.actor?.nationalId || ''
                      valueJson['isLoggedInUser'] = true
                      valueJson['applicantType'] = type
                    } else if (
                      type === ApplicantTypesEnum.LEGAL_ENTITY ||
                      type ===
                        ApplicantTypesEnum.LEGAL_ENTITY_OF_PROCURATION_HOLDER ||
                      type === ApplicantTypesEnum.INDIVIDUAL_GIVING_DELEGATION
                    ) {
                      valueJson['nationalId'] = user.nationalId
                      valueJson['applicantType'] = type
                    }
                  }
                  return this.valueModel.create(
                    {
                      fieldId: field.id,
                      fieldType: field.fieldType,
                      applicationId: newApplication.id,
                      json: valueJson,
                    } as Value,
                    { transaction },
                  )
                }) || [],
              ),
            ) || [],
          ),
        ),
      )

      newApplicationId = newApplication.id
    })
    const applicationDto = await this.getApplication(newApplicationId, '', null)

    return applicationDto
  }

  async update(
    id: string,
    updateApplicationDto: UpdateApplicationDto,
  ): Promise<void> {
    const application = await this.applicationModel.findByPk(id)

    if (!application) {
      throw new NotFoundException(`Application with id '${id}' not found`)
    }

    application.dependencies = updateApplicationDto.dependencies
    application.completed = updateApplicationDto.completed

    await application.save()
  }

  async submitScreen(
    screenId: string,
    applicationDto: ApplicationDto,
  ): Promise<ScreenValidationResponse> {
    const sections = applicationDto.sections

    if (!sections) {
      throw new NotFoundException(`Sections not found`)
    }
    const screenDto = sections
      .flatMap((section) => section.screens || [])
      .find((screen) => screen.id === screenId)

    if (!screenDto) {
      throw new NotFoundException(`Screen with id '${screenId}' not found`)
    }

    const filteredFields = screenDto.fields?.filter(
      (field) => field.isHidden === false,
    )
    const filteredScreenDto = { ...screenDto, fields: filteredFields }

    filteredScreenDto.fields?.forEach(async (field) => {
      await this.valueModel.destroy({
        where: {
          fieldId: field.id,
          applicationId: applicationDto.id,
        },
      })

      field.values?.forEach(async (value, index) => {
        await this.valueModel.create({
          fieldId: field.id,
          fieldType: field.fieldType,
          applicationId: applicationDto.id,
          order: index,
          json: value.json,
        } as Value)
      })
    })

    // internal validation of the input values of the screen
    const screenValidationResponse =
      this.serviceManager.validation(filteredScreenDto)

    // TODO: Send the input values to the service manager for external validation

    // TODO: Check if the section is also completed
    return screenValidationResponse
  }

  async submit(id: string): Promise<boolean> {
    const application = await this.applicationModel.findByPk(id)
    const form = await this.formModel.findByPk(application?.formId || '')

    if (!application) {
      throw new NotFoundException(`Application with id '${id}' not found.`)
    }

    if (!form) {
      throw new NotFoundException(
        `Form with id '${application.formId}' not found.`,
      )
    }

    const applicationResponseDto = await this.getApplication(id, '', null)
    if (!applicationResponseDto.application) {
      throw new NotFoundException(`Application DTO with id '${id}' not found.`)
    }
    const applicationDto = applicationResponseDto.application
    applicationDto.submittedAt = new Date()

    const success: boolean = await this.serviceManager.send(applicationDto)

    if (success) {
      application.status = ApplicationStatus.COMPLETED
      application.submittedAt = applicationDto.submittedAt
      application.pruneAt = calculatePruneAt(form.daysUntilApplicationPrune)
      await this.sequelize.transaction(async (transaction) => {
        await application.save({ transaction })

        await this.applicationEventModel.create(
          {
            applicationId: application.id,
            eventType: ApplicationEvents.APPLICATION_SUBMITTED,
            eventMessage: {
              is: 'Umsókn móttekin',
              en: 'Application submitted',
            },
          } as ApplicationEvent,
          { transaction },
        )
      })
    }

    return success
  }

  async findAllByOrganization(
    organizationNationalId: string,
    page: number,
    limit: number,
    isTest: boolean,
  ): Promise<ApplicationResponseDto> {
    const organization = await this.organizationModel.findOne({
      where: { nationalId: organizationNationalId },
      attributes: ['id'],
    })

    const organizationId = organization?.id

    const offset = (page - 1) * limit
    const { count: total, rows: data } =
      await this.applicationModel.findAndCountAll({
        where: { organizationId: organizationId, isTest: isTest },
        limit,
        offset,
        include: [
          {
            model: ApplicationEvent,
            as: 'events',
          },
          {
            model: Value,
            as: 'files',
            where: { fieldType: FieldTypesEnum.FILE },
          },
        ],
        order: [
          [{ model: ApplicationEvent, as: 'events' }, 'created', 'ASC'],
          [{ model: Value, as: 'files' }, 'created', 'ASC'],
        ],
      })

    const applicationMinimalDtos = await Promise.all(
      data.map(async (application) => {
        const form = await this.formModel.findByPk(application.formId)
        return this.applicationMapper.mapApplicationToApplicationMinimalDto(
          application,
          form,
        )
      }),
    )

    const applicationResponseDto = new ApplicationResponseDto()
    applicationResponseDto.applications = applicationMinimalDtos
    applicationResponseDto.total = total
    applicationResponseDto.organizations = await this.organizationModel
      .findAll({
        attributes: ['nationalId'],
      })
      .then((organizations) =>
        organizations.map(
          (org) =>
            ({
              value: org.nationalId,
              label: '',
              isSelected: org.nationalId === organizationNationalId,
            } as Option),
        ),
      )
    return applicationResponseDto
  }

  async getApplication(
    applicationId: string,
    slug: string,
    user: User | null,
  ): Promise<ApplicationResponseDto> {
    const application = await this.applicationModel.findOne({
      where: { id: applicationId },
      include: [
        {
          model: ApplicationEvent,
          as: 'events',
        },
        {
          model: Value,
          as: 'values',
        },
      ],
      order: [[{ model: ApplicationEvent, as: 'events' }, 'created', 'ASC']],
    })

    if (!application) {
      throw new NotFoundException(
        `Application with id '${applicationId}' not found`,
      )
    }

    const form = await this.getApplicationForm(
      application.formId,
      applicationId,
      slug,
    )

    const allowedLoginTypes = await this.getAllowedLoginTypes(form)

    if (user) {
      const loginTypes = await this.getLoginTypes(user)
      if (
        !this.isLoginAllowed(loginTypes, allowedLoginTypes) ||
        !this.doesUserMatchApplication(application, user, loginTypes)
      ) {
        const responseDto = new ApplicationResponseDto()
        responseDto.isLoginTypeAllowed = false
        return responseDto
      }
    }

    const applicationDto = this.applicationMapper.mapFormToApplicationDto(
      form,
      application,
    )

    applicationDto.organizationName = form.organizationDisplayName
    const responseDto = new ApplicationResponseDto()
    responseDto.application = applicationDto
    responseDto.isLoginTypeAllowed = true

    return responseDto
  }

  async findAllBySlugAndUser(
    slug: string,
    user: User,
  ): Promise<ApplicationResponseDto> {
    const form: Form = await this.getForm(slug)

    if (!form) {
      throw new NotFoundException(`Form with slug '${slug}' not found`)
    }

    const allowedLoginTypes = await this.getAllowedLoginTypes(form)

    const loginTypes = await this.getLoginTypes(user)
    if (!this.isLoginAllowed(loginTypes, allowedLoginTypes)) {
      const responseDto = new ApplicationResponseDto()
      responseDto.isLoginTypeAllowed = false
      return responseDto
    }

    const existingApplications = await this.findAllByUserAndForm(
      user,
      form.id,
      slug,
    )
    const responseDto = new ApplicationResponseDto()
    responseDto.applications = existingApplications
    responseDto.isLoginTypeAllowed = true
    return responseDto
  }

  async findAllByNationalId(
    locale: Locale,
    user: User,
  ): Promise<MyPagesApplicationResponseDto[]> {
    const hasDelegation =
      Array.isArray(user.delegationType) && user.delegationType.length > 0
    const nationalId = hasDelegation ? user.actor?.nationalId : user.nationalId

    const applications = await this.applicationModel.findAll({
      where: {
        nationalId,
        pruned: false,
        isTest: false,
      },
      include: [
        { model: Value, as: 'values' },
        { model: ApplicationEvent, as: 'events' },
      ],
    })

    const loginTypes = await this.getLoginTypes(user)
    const applicationsByUser = await this.getApplicationsByUser(
      applications,
      user,
      loginTypes,
    )

    for (const app of applicationsByUser) {
      const form = await this.formModel.findByPk(app.formId)
      if (form && form.name) {
        app.formName = locale === 'is' ? form.name.is : form.name.en
      }
      if (form && form.slug) {
        app.formSlug = form.slug
      }
      if (app.status === ApplicationStatus.DRAFT) {
        app.tagLabel = locale === 'is' ? 'Í vinnslu' : 'In progress'
        app.tagVariant = 'blue'
      }
      if (app.status === ApplicationStatus.COMPLETED) {
        app.tagLabel = locale === 'is' ? 'Innsend' : 'Completed'
        app.tagVariant = 'mint'
      }

      const organizationInfo = getOrganizationInfoByNationalId(
        form?.organizationNationalId ?? '',
      )

      app.orgSlug = organizationInfo?.type
      app.orgContentfulId = organizationInfo?.contentfulId
    }

    const mappedApplications =
      await this.applicationMapper.mapApplicationsToMyPagesApplications(
        applicationsByUser,
        locale,
      )

    return mappedApplications
  }

  private async findAllByUserAndForm(
    user: User,
    formId: string,
    slug: string,
  ): Promise<ApplicationDto[]> {
    const hasDelegation =
      Array.isArray(user.delegationType) && user.delegationType.length > 0
    const nationalId = hasDelegation ? user.actor?.nationalId : user.nationalId

    const applications = await this.applicationModel.findAll({
      where: {
        nationalId,
        formId,
        status: { [Op.in]: [ApplicationStatus.DRAFT] },
        pruned: false,
      },
      include: [{ model: Value, as: 'values' }],
    })

    const loginTypes = await this.getLoginTypes(user)
    const applicationsByUser = await this.getApplicationsByUser(
      applications,
      user,
      loginTypes,
    )

    const applicationDtos: ApplicationDto[] = []

    for (const application of applicationsByUser) {
      const applicationResponseDto = await this.getApplication(
        application.id,
        slug,
        null,
      )
      if (!applicationResponseDto.application) {
        throw new NotFoundException(
          `Application DTO with id '${application.id}' not found.`,
        )
      }
      const applicationDto = applicationResponseDto.application
      applicationDtos.push(applicationDto)
    }

    return applicationDtos
  }

  private async getAllowedLoginTypes(form: Form): Promise<string[]> {
    const result: string[] = []

    const partySection = form.sections.find(
      (section) => section.sectionType === SectionTypes.PARTIES,
    )

    if (!partySection) {
      throw new NotFoundException(
        `Party section not found in form with id '${form.id}'`,
      )
    }

    for (const screen of partySection.screens ?? []) {
      for (const field of screen.fields ?? []) {
        const applicantType = field?.fieldSettings?.applicantType
        if (applicantType) {
          result.push(applicantType)
        }
      }
    }

    return result
  }

  private isLoginAllowed(
    loginTypes: string[],
    allowedLoginTypes: string[],
  ): boolean {
    return (
      loginTypes.length > 0 &&
      loginTypes.every((type) => allowedLoginTypes.includes(type))
    )
  }

  private doesUserMatchApplication(
    application: Application,
    user: User,
    loginTypes: string[],
  ): boolean {
    const hasDelegation =
      Array.isArray(user.delegationType) && user.delegationType.length > 0
    const nationalId = hasDelegation ? user.actor?.nationalId : user.nationalId
    const delegatorNationalId = hasDelegation ? user.nationalId : null

    const loggedInUser = application.values?.find(
      (value) =>
        value.fieldType === FieldTypesEnum.APPLICANT &&
        value.json?.nationalId === nationalId &&
        loginTypes.includes(value.json?.applicantType ?? ''),
    )

    const delegator = delegatorNationalId
      ? application.values?.find(
          (value) =>
            value.fieldType === FieldTypesEnum.APPLICANT &&
            value.json?.nationalId === delegatorNationalId &&
            loginTypes.includes(value.json?.applicantType ?? ''),
        )
      : null

    if (hasDelegation === true) {
      if (loggedInUser && delegator) {
        return true
      }
    } else {
      if (loggedInUser) {
        return true
      }
    }

    return false
  }

  private async getApplicationsByUser(
    applications: Application[],
    user: User,
    loginTypes: string[],
  ): Promise<Application[]> {
    const filteredApplications: Application[] = []

    for (const application of applications) {
      if (this.doesUserMatchApplication(application, user, loginTypes)) {
        filteredApplications.push(application)
      }
    }
    return filteredApplications
  }

  private async getApplicationForm(
    formId: string,
    applicationId: string,
    slug: string,
  ): Promise<Form> {
    const form = await this.formModel.findOne({
      where: { id: formId },
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
                    {
                      model: Value,
                      as: 'values',
                      where: {
                        applicationId: applicationId,
                      },
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
          { model: Value, as: 'values' },
          'order',
          'ASC',
        ],
      ],
    })

    if (!form) {
      throw new NotFoundException(`Form with id '${formId}' not found`)
    }

    if (slug && form.slug !== slug) {
      throw new NotFoundException(
        `Form with slug '${slug}' not found for application '${applicationId}'`,
      )
    }

    if (form.status === FormStatus.ARCHIVED) {
      throw new ConflictException(`Form with id '${formId}' is archived`)
    }

    return form
  }

  private async getForm(slug: string): Promise<Form> {
    const form = await this.formModel.findOne({
      where: { slug: slug },
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
      ],
    })

    if (!form) {
      throw new NotFoundException(`Form with slug '${slug}' not found`)
    }

    return form
  }

  // eslint-disable-next-line
  private updateObjectValues<T extends Record<string, any>>(
    source: T,
    target: T,
  ): T {
    const updated = { ...target } // copy to avoid mutating directly
    ;(Object.keys(source) as (keyof T)[]).forEach((key) => {
      updated[key] = source[key]
    })
    return updated
  }

  async saveScreen(
    screenId: string,
    submitScreenDto: SubmitScreenDto,
  ): Promise<ScreenDto> {
    const screen = await this.screenModel.findByPk(screenId)

    if (!screen) {
      throw new NotFoundException(`Screen with id '${screenId}' not found`)
    }
    const { screenDto, applicationId } = submitScreenDto

    if (!screenDto) {
      throw new NotFoundException(`ScreenDto not found`)
    }

    const application = await this.applicationModel.findByPk(applicationId)

    if (!application) {
      throw new NotFoundException(
        `Application with id '${applicationId}' not found`,
      )
    }

    if (screenDto.fields) {
      for (const field of screenDto.fields) {
        if (field.values) {
          for (const value of field.values) {
            const existingValue = await this.valueModel.findOne({
              where: {
                fieldId: field.id,
                applicationId: applicationId,
                id: value.id,
              },
            })

            const updatedJson = this.updateObjectValues(
              value.json || {},
              existingValue?.json || {},
            )

            await this.valueModel.update(
              { json: updatedJson },
              {
                where: {
                  fieldId: field.id,
                  applicationId: applicationId,
                  id: value.id,
                },
              },
            )
          }
        }
      }
    }

    if (!application.completed?.includes(screen.id)) {
      await application.update({
        ...application,
        completed: [...(application.completed ?? []), screen.id],
      })
    }
    const lastScreen = await this.screenModel.findOne({
      where: { sectionId: screen.sectionId },
      order: [['displayOrder', 'DESC']],
    })
    if (
      lastScreen &&
      lastScreen.id === screenId &&
      !application.completed?.includes(screen.sectionId)
    ) {
      await application.update({
        ...application,
        completed: [...(application.completed ?? []), screen.sectionId],
        draftFinishedSteps: application.draftFinishedSteps + 1,
      })
      await application.update({
        ...application,

        draftTotalSteps: await this.calculateDraftTotalSteps(
          application.formId,
          application.dependencies || [],
        ),
      })
    }

    const screenResult = await this.screenModel.findByPk(screenId, {
      include: [{ model: this.fieldModel, include: [this.valueModel] }],
    })

    if (!screenResult) {
      throw new NotFoundException(`Screen with id '${screenId}' not found`)
    }
    return screenResult as unknown as ScreenDto
  }

  async submitSection(applicationId: string, sectionId: string): Promise<void> {
    const application = await this.applicationModel.findByPk(applicationId)

    if (!application) {
      throw new NotFoundException(
        `Application with id '${applicationId}' not found`,
      )
    }

    const section = await this.sectionModel.findByPk(sectionId, {
      include: [
        {
          model: Screen,
          as: 'screens',
          include: [
            {
              model: Field,
              as: 'fields',
              include: [this.valueModel],
            },
          ],
        },
      ],
    })

    if (!section) {
      throw new NotFoundException(`Section with id '${sectionId}' not found`)
    }

    // Mark the section as completed
    if (!application.completed?.includes(section.id)) {
      application.completed = [...(application.completed ?? []), section.id]
      if (section.sectionType !== SectionTypes.PREMISES) {
        application.draftFinishedSteps += 1
      }
    }

    application.draftTotalSteps = await this.calculateDraftTotalSteps(
      application.formId,
      application.dependencies || [],
    )

    await application.save()
  }

  async deleteApplication(id: string): Promise<void> {
    const application = await this.applicationModel.findByPk(id)

    if (!application) {
      throw new NotFoundException(`Application with id '${id}' not found`)
    }

    await this.valueModel.destroy({
      where: { applicationId: id },
    })

    await application.destroy()
  }

  private async calculateDraftTotalSteps(
    formId: string,
    dependencies: Dependency[],
  ): Promise<number> {
    const form = await this.formModel.findByPk(formId, {
      include: [{ model: Section, as: 'sections' }],
    })

    if (!form) {
      throw new NotFoundException(`Form with id '${formId}' not found`)
    }

    const wantedSectionTypes = [SectionTypes.PARTIES, SectionTypes.INPUT]

    const sections = form.sections.filter((section) =>
      wantedSectionTypes.includes(section.sectionType),
    )

    const totalSteps =
      sections.length +
      (form.hasSummaryScreen ? 1 : 0) +
      (form.hasPayment ? 1 : 0)

    const hiddenSteps = dependencies
      .filter((dependency) => dependency.isSelected === false)
      .flatMap((dependency) => dependency.childProps)
      .filter((id) => sections.some((section) => section.id === id))

    return totalSteps - hiddenSteps.length
  }

  private async getLoginTypes(user: User): Promise<string[]> {
    const loginTypes: string[] = []

    if (user.delegationType && user.delegationType.length > 0) {
      if (user.delegationType.includes(AuthDelegationType.ProcurationHolder)) {
        loginTypes.push(ApplicantTypesEnum.INDIVIDUAL_WITH_PROCURATION)
        loginTypes.push(ApplicantTypesEnum.LEGAL_ENTITY_OF_PROCURATION_HOLDER)
      } else if (user.delegationType.includes(AuthDelegationType.Custom)) {
        if (kennitala.isCompany(user.nationalId)) {
          loginTypes.push(
            ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_LEGAL_ENTITY,
          )
          loginTypes.push(ApplicantTypesEnum.LEGAL_ENTITY)
        } else {
          loginTypes.push(
            ApplicantTypesEnum.INDIVIDUAL_WITH_DELEGATION_FROM_INDIVIDUAL,
          )
          loginTypes.push(ApplicantTypesEnum.INDIVIDUAL_GIVING_DELEGATION)
        }
      }
    } else {
      loginTypes.push(ApplicantTypesEnum.INDIVIDUAL)
    }

    return loginTypes
  }
}
