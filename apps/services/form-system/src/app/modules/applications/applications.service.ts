import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
import { User } from '@island.is/auth-nest-tools'
import { FormCertificationType } from '../formCertificationTypes/models/formCertificationType.model'
import { SubmitScreenDto } from './models/dto/submitScreen.dto'
import { ScreenDto } from '../screens/models/dto/screen.dto'
import { Option } from '../../dataTypes/option.model'
import { FormStatus } from '@island.is/form-system/shared'
import { MyPagesApplicationResponseDto } from './models/dto/myPagesApplication.response.dto'
import { SectionTypes } from '@island.is/form-system/shared'
import { getOrganizationInfoByNationalId } from '../../../utils/organizationInfo'
import { AuthDelegationType } from '@island.is/shared/types'
import * as kennitala from 'kennitala'
import type { Locale } from '@island.is/shared/types'
import { calculatePruneAt } from '../../../utils/calculatePruneAt'
import { SectionDto } from '../sections/models/dto/section.dto'
import { SubmitApplicationResponseDto } from './models/dto/submitApplication.response.dto'

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
  ) {}

  async create(slug: string, user: User): Promise<ApplicationResponseDto> {
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

    if (updateApplicationDto.completed) {
      const completedToRemove = updateApplicationDto.completed ?? []

      application.completed = (application.completed ?? []).filter(
        (completedId) => !completedToRemove.includes(completedId),
      )

      const form = await this.formModel.findByPk(application.formId, {
        include: [{ model: Section, as: 'sections' }],
      })

      if (!form) {
        throw new NotFoundException(
          `Form with id '${application.formId}' not found`,
        )
      }

      let draftFinishedSteps = 0

      for (const section of form.sections.filter(
        (s) =>
          s.sectionType === SectionTypes.INPUT ||
          s.sectionType === SectionTypes.PARTIES,
      ) || []) {
        if (section.id && application.completed.includes(section.id)) {
          draftFinishedSteps = draftFinishedSteps + 1
        }
      }

      application.draftFinishedSteps = draftFinishedSteps
    }

    if (updateApplicationDto.dependencies) {
      application.dependencies = updateApplicationDto.dependencies
    }

    await application.save()
  }

  async submit(id: string): Promise<SubmitApplicationResponseDto> {
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
    applicationDto.status = ApplicationStatus.COMPLETED
    const applicationEvent = await this.applicationEventModel.create({
      applicationId: application.id,
      eventType: ApplicationEvents.APPLICATION_SUBMITTED,
      eventMessage: {
        is: 'Umsókn móttekin',
        en: 'Application submitted',
      },
    } as ApplicationEvent)
    if (!applicationDto.events) {
      applicationDto.events = []
    }
    applicationDto.events.push(applicationEvent)

    const success: boolean = await this.serviceManager.send(applicationDto)

    if (success) {
      try {
        application.status = applicationDto.status
        application.submittedAt = applicationDto.submittedAt
        application.pruneAt = calculatePruneAt(form.daysUntilApplicationPrune)
        await application.save()
      } catch (error) {
        await applicationEvent.destroy()
        throw error
      }
    } else {
      await applicationEvent.destroy()
    }

    const submitResponseDto = new SubmitApplicationResponseDto()
    submitResponseDto.success = success
    if (!success) {
      submitResponseDto.screenErrorMessages = [
        {
          title: { is: 'Villa við innsendingu', en: 'Error submitting' },
          message: {
            is: 'Ekki tókst að senda inn umsóknina, reyndu aftur síðar eða sendu póst á island@island.is',
            en: 'The application could not be submitted. Please try again later or send an email to island@island.is',
          },
        },
      ]
    }
    return submitResponseDto
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

  async findAll(
    page: number,
    limit: number,
    isTest: boolean,
  ): Promise<ApplicationResponseDto> {
    const offset = (page - 1) * limit
    const { count: total, rows: data } =
      await this.applicationModel.findAndCountAll({
        where: { isTest: isTest },
        limit,
        offset,
        include: [
          {
            model: ApplicationEvent,
            as: 'events',
          },
          // TODOx afhverju erum við að sækja files?
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

    return {
      applications: applicationMinimalDtos,
      total: total,
    }
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

  async saveScreen(
    submitScreenDto: SubmitScreenDto,
    user: User,
  ): Promise<void> {
    const {
      applicationId,
      screenId: currentScreenId = '',
      sectionId: currentSectionId = '',
      sections,
    } = submitScreenDto
    const currentSection = this.getCurrentSection(sections, currentSectionId)
    const currentScreen = this.getCurrentScreen(currentSection, currentScreenId)

    const application = await this.applicationModel.findByPk(applicationId, {
      include: [{ model: Value, as: 'values' }],
    })

    if (!application) {
      throw new NotFoundException(
        `Application with id '${applicationId}' not found`,
      )
    }

    const loginTypes = await this.getLoginTypes(user)
    if (!this.doesUserMatchApplication(application, user, loginTypes)) {
      throw new UnauthorizedException(
        `User is not authorized to save screen for application '${applicationId}'`,
      )
    }

    let completedArray = application.completed || []
    let draftFinishedSteps = application.draftFinishedSteps || 0

    // Going forward or backward in the application
    if (submitScreenDto.increment === true) {
      if (this.doesSectionHaveScreen(currentSection)) {
        if (!completedArray.includes(currentScreenId)) {
          completedArray = [...completedArray, currentScreenId]
        }
        if (this.isLastScreenInSection(currentSection, currentScreenId)) {
          if (!completedArray.includes(currentSectionId)) {
            completedArray = [...completedArray, currentSectionId]
            draftFinishedSteps = draftFinishedSteps + 1
          }
        }
      } else {
        if (!completedArray.includes(currentSectionId)) {
          completedArray = [...completedArray, currentSectionId]
          if (currentSection.sectionType !== SectionTypes.PREMISES) {
            draftFinishedSteps = draftFinishedSteps + 1
          }
        }
      }
    } else {
      if (
        this.doesSectionHaveScreen(currentSection) &&
        !this.isFirstScreenInSection(currentSection, currentScreenId)
      ) {
        const previousScreen = this.getPreviousScreen(
          currentSection,
          currentScreenId,
        )
        if (previousScreen && completedArray.includes(previousScreen.id)) {
          completedArray = completedArray.filter(
            (id) => id !== previousScreen.id,
          )
        }
      } else if (
        !this.doesSectionHaveScreen(currentSection) ||
        (this.doesSectionHaveScreen(currentSection) &&
          this.isFirstScreenInSection(currentSection, currentScreenId))
      ) {
        const previousSection = this.getPreviousSection(
          sections,
          currentSectionId,
        )
        if (previousSection) {
          if (completedArray.includes(previousSection.id)) {
            completedArray = completedArray.filter(
              (id) => id !== previousSection.id,
            )
            draftFinishedSteps = Math.max(0, draftFinishedSteps - 1)
          }
          if (this.doesSectionHaveScreen(previousSection)) {
            const lastScreenOfPreviousSection =
              this.getLastScreenInSection(previousSection)
            if (
              lastScreenOfPreviousSection &&
              completedArray.includes(lastScreenOfPreviousSection.id)
            ) {
              completedArray = completedArray.filter(
                (id) => id !== lastScreenOfPreviousSection.id,
              )
            }
          }
        }
      }
    }

    await this.sequelize.transaction(async (transaction) => {
      application.completed = completedArray
      application.draftFinishedSteps = draftFinishedSteps
      application.draftTotalSteps = await this.calculateDraftTotalSteps(
        sections,
      )
      await application.save({ transaction })

      if (currentScreen) {
        const filteredFields = currentScreen.fields?.filter(
          (field) => field.isHidden === false,
        )

        const filteredScreenDto = { ...currentScreen, fields: filteredFields }
        await Promise.all(
          (filteredScreenDto.fields ?? []).map(async (field) => {
            if (field.isPartOfMultiset) {
              await this.valueModel.destroy({
                where: {
                  fieldId: field.id,
                  applicationId,
                },
                transaction,
              })

              await Promise.all(
                (field.values ?? []).map((value, index) =>
                  this.valueModel.create(
                    {
                      fieldId: field.id,
                      fieldType: field.fieldType,
                      applicationId,
                      order: index,
                      json: value.json,
                    } as Value,
                    { transaction },
                  ),
                ),
              )
            } else {
              await Promise.all(
                (field.values ?? [])
                  .filter((v) => v?.json !== undefined)
                  .map((value) =>
                    this.valueModel.update(
                      {
                        // Merge existing jsonb with the new payload as jsonb
                        // COALESCE guards against "json" being NULL
                        json: this.sequelize.literal(
                          `COALESCE("json", '{}'::jsonb) || ${this.sequelize.escape(
                            JSON.stringify(value.json),
                          )}::jsonb`,
                        ),
                      },
                      {
                        where: {
                          id: value.id,
                          applicationId,
                          fieldId: field.id,
                        },
                        transaction,
                      },
                    ),
                  ),
              )
            }
          }),
        )
      }
    })
  }

  async deleteApplication(id: string, user: User): Promise<void> {
    const application = await this.applicationModel.findByPk(id, {
      include: [{ model: Value, as: 'values' }],
    })

    if (!application) {
      throw new NotFoundException(`Application with id '${id}' not found`)
    }

    const loginTypes = await this.getLoginTypes(user)
    if (!this.doesUserMatchApplication(application, user, loginTypes)) {
      throw new UnauthorizedException(
        `User is not authorized to delete application '${id}'`,
      )
    }

    await this.sequelize.transaction(async (transaction) => {
      await this.applicationEventModel.destroy({
        where: { applicationId: id },
        transaction,
      })

      await this.valueModel.destroy({
        where: { applicationId: id },
        transaction,
      })

      await application.destroy({ transaction })
    })
  }

  private doesSectionHaveScreen(sectionDto: SectionDto): boolean {
    return sectionDto.screens !== undefined && sectionDto.screens.length > 0
  }

  private isLastScreenInSection(
    sectionDto: SectionDto,
    screenId: string,
  ): boolean {
    const screens = sectionDto.screens ?? []
    const idx = screens.findIndex((s) => s.id === screenId)

    if (idx === -1) {
      throw new NotFoundException(
        `Screen with id '${screenId}' not found in section '${sectionDto.id}'`,
      )
    }

    for (let i = idx + 1; i < screens.length; i++) {
      if (screens[i]?.isHidden === false) {
        return false
      }
    }

    return true
  }

  private isFirstScreenInSection(
    sectionDto: SectionDto,
    screenId: string,
  ): boolean {
    const screens = sectionDto.screens ?? []
    const idx = screens.findIndex((s) => s.id === screenId)

    if (idx === -1) {
      throw new NotFoundException(
        `Screen with id '${screenId}' not found in section '${sectionDto.id}'`,
      )
    }

    for (let i = 0; i < idx; i++) {
      if (screens[i]?.isHidden === false) {
        return false
      }
    }

    return true
  }

  private getCurrentScreen(
    sectionDto: SectionDto,
    screenId: string,
  ): ScreenDto | null {
    if (screenId === '') {
      return null
    }
    const list = sectionDto.screens ?? []
    const screenDto = list.find((screen) => screen.id === screenId)

    if (!screenDto) {
      throw new NotFoundException(
        `Screen with id '${screenId}' not found in section '${sectionDto.id}'`,
      )
    }

    return screenDto
  }

  private getPreviousScreen(
    sectionDto: SectionDto,
    screenId: string,
  ): ScreenDto | null {
    const list = sectionDto.screens ?? []
    const idx = list.findIndex((s) => s.id === screenId)
    if (idx <= 0) {
      return null
    }
    for (let i = idx - 1; i >= 0; i--) {
      const screen = list[i]
      if (screen?.isHidden === false) {
        return screen
      }
    }
    return null
  }

  private getCurrentSection(
    sections: SectionDto[] | undefined,
    sectionId: string,
  ): SectionDto {
    const list = sections ?? []
    const sectionDto = list.find((section) => section.id === sectionId)

    if (!sectionDto) {
      throw new NotFoundException(
        `Section with id '${sectionId}' not found in application`,
      )
    }

    return sectionDto
  }

  private getPreviousSection(
    sections: SectionDto[] | undefined,
    sectionId: string,
  ): SectionDto | null {
    const list = sections ?? []
    const idx = list.findIndex((s) => s.id === sectionId)
    if (idx <= 0) {
      return null
    }
    for (let i = idx - 1; i >= 0; i--) {
      const section = list[i]
      if (section?.isHidden === false) {
        return section
      }
    }
    return null
  }

  private getLastScreenInSection(sectionDto: SectionDto): ScreenDto | null {
    const screens = sectionDto.screens ?? []
    for (let i = screens.length - 1; i >= 0; i--) {
      const screen = screens[i]
      if (screen?.isHidden === false) {
        return screen
      }
    }
    return null
  }

  private async calculateDraftTotalSteps(
    sections: SectionDto[] | undefined,
  ): Promise<number> {
    sections = sections?.filter(
      (section) =>
        section.isHidden === false &&
        section.sectionType !== SectionTypes.PREMISES &&
        section.sectionType !== SectionTypes.COMPLETED,
    )
    const draftTotalSteps = sections?.length || 0

    return draftTotalSteps
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
