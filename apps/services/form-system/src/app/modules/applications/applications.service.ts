import {
  BadRequestException,
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
  ): Promise<ApplicationDto> {
    // TODO: Check if user is allowed to create application for this form
    // TODO: Check if form is published

    const form: Form = await this.getForm(slug)

    if (!form) {
      throw new NotFoundException(`Form with slug '${slug}' not found`)
    }

    // Check if at least one of the user's delegationTypes is allowed for this form
    if (
      form.allowedDelegationTypes.length > 0 &&
      (!user.delegationType || user.delegationType.length === 0
        ? !form.allowedDelegationTypes.includes('Individual')
        : !user.delegationType.some((type) =>
            form.allowedDelegationTypes.includes(type),
          ))
    ) {
      throw new BadRequestException(
        `User delegationTypes '${
          user.delegationType ? user.delegationType.join(', ') : 'none'
        }' are not allowed for this form`,
      )
    }

    let newApplicationId = ''

    const isTest = form.status !== FormStatus.PUBLISHED

    await this.sequelize.transaction(async (transaction) => {
      const newApplication: Application = await this.applicationModel.create(
        {
          formId: form.id,
          organizationId: form.organizationId,
          isTest: isTest,
          dependencies: form.dependencies,
          status: ApplicationStatus.IN_PROGRESS,
        } as Application,
        { transaction },
      )

      await this.applicationEventModel.create(
        {
          eventType: ApplicationEvents.APPLICATION_CREATED,
          applicationId: newApplication.id,
        } as ApplicationEvent,
        { transaction },
      )

      // TODO: finna út aðilana með því að skoða tókenið frá usernum.
      // búa bara til aðila screens og fields fyrir þá aðila sem eru hlutaðeigandi þessarar umsóknar
      // console.log('user:', JSON.stringify(user, null, 2))

      await Promise.all(
        form.sections.map((section) =>
          Promise.all(
            section.screens?.map((screen) =>
              Promise.all(
                screen.fields?.map(async (field) => {
                  return this.valueModel.create(
                    {
                      fieldId: field.id,
                      fieldType: field.fieldType,
                      applicationId: newApplication.id,
                      json: ValueTypeFactory.getClass(
                        field.fieldType,
                        new ValueType(),
                      ),
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
    const applicationDto = await this.getApplication(newApplicationId)
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
        const newValue = await this.valueModel.create({
          fieldId: field.id,
          fieldType: field.fieldType,
          applicationId: applicationDto.id,
          order: index,
          json: value.json,
        } as Value)

        if (field.fieldType === FieldTypesEnum.FILE) {
          await this.applicationEventModel.create({
            eventType: ApplicationEvents.FILE_CREATED,
            applicationId: applicationDto.id,
            isFileEvent: true,
            valueId: newValue.id,
          } as ApplicationEvent)
        }
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

    if (!application) {
      throw new NotFoundException(`Application with id '${id}' not found.`)
    }

    const applicationDto = await this.getApplication(id)
    applicationDto.submittedAt = new Date()

    const success: boolean = await this.serviceManager.send(applicationDto)

    if (success) {
      application.status = ApplicationStatus.SUBMITTED
      application.submittedAt = new Date()
      await application.save()
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
            where: { isFileEvent: false },
          },
          {
            model: Value,
            as: 'files',
            where: { fieldType: FieldTypesEnum.FILE },
            include: [
              {
                model: ApplicationEvent,
                as: 'events',
              },
            ],
          },
        ],
        order: [
          [{ model: ApplicationEvent, as: 'events' }, 'created', 'ASC'],
          [
            { model: Value, as: 'files' },
            { model: ApplicationEvent, as: 'events' },
            'created',
            'ASC',
          ],
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
        attributes: ['nationalId', 'name'],
      })
      .then((organizations) =>
        organizations.map(
          (org) =>
            ({
              value: org.nationalId,
              label: org.name.is,
              isSelected: org.nationalId === organizationNationalId,
            } as Option),
        ),
      )
    return applicationResponseDto
  }

  async getApplication(applicationId: string): Promise<ApplicationDto> {
    const application = await this.applicationModel.findOne({
      where: { id: applicationId },
      include: [
        {
          model: ApplicationEvent,
          as: 'events',
          where: { isFileEvent: false },
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
    )

    const applicationDto = this.applicationMapper.mapFormToApplicationDto(
      form,
      application,
    )

    const organization = await this.organizationModel.findByPk(
      form.organizationId,
    )
    applicationDto.organizationName = organization?.name

    return applicationDto
  }

  async findAllBySlugAndUser(
    slug: string,
    user: User,
    isTest: boolean,
  ): Promise<ApplicationResponseDto> {
    // TODO: Check if form is published

    const form: Form = await this.getForm(slug)

    if (!form) {
      throw new NotFoundException(`Form with slug '${slug}' not found`)
    }

    // Check if at least one of the user's delegationTypes is allowed for this form
    if (
      form.allowedDelegationTypes.length > 0 &&
      (!user.delegationType || user.delegationType.length === 0
        ? !form.allowedDelegationTypes.includes('Individual')
        : !user.delegationType.some((type) =>
            form.allowedDelegationTypes.includes(type),
          ))
    ) {
      throw new BadRequestException(
        `User delegationTypes '${
          user.delegationType ? user.delegationType.join(', ') : 'none'
        }' are not allowed for this form`,
      )
    }

    // Check if the user has applications for this form
    const existingApplications = await this.findAllByUserAndForm(
      user,
      form.id,
      isTest,
    )
    const responseDto = new ApplicationResponseDto()
    responseDto.applications = existingApplications
    return responseDto
  }

  private async findAllByUserAndForm(
    user: User,
    formId: string,
    isTest: boolean,
  ): Promise<ApplicationDto[]> {
    // TODO: Check if form is published

    const hasDelegation =
      Array.isArray(user.delegationType) && user.delegationType.length > 0
    const nationalId = hasDelegation ? user.actor?.nationalId : user.nationalId
    const delegatorNationalId = hasDelegation ? user.nationalId : null

    const applications = await this.applicationModel.findAll({
      where: {
        formId,
        status: { [Op.ne]: ApplicationStatus.PRUNED },
        isTest,
      },
      include: [{ model: Value, as: 'values' }],
    })

    const applicationDtos: ApplicationDto[] = []

    for (const application of applications) {
      const loggedInUser = application.values?.find(
        (value) =>
          value.fieldType === FieldTypesEnum.APPLICANT &&
          value.json?.nationalId === nationalId,
      )

      const delegator = delegatorNationalId
        ? application.values?.find(
            (value) =>
              value.fieldType === FieldTypesEnum.APPLICANT &&
              value.json?.nationalId === delegatorNationalId,
          )
        : null

      if (
        loggedInUser &&
        (!delegatorNationalId || (delegatorNationalId && delegator))
      ) {
        const applicationDto = await this.getApplication(application.id)
        applicationDtos.push(applicationDto)
      }
    }
    return applicationDtos
  }

  private async getApplicationForm(
    formId: string,
    applicationId: string,
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

    await application.update({
      ...application,
      completed: [...(application.completed ?? []), screen.id],
    })
    const lastScreen = await this.screenModel.findOne({
      where: { sectionId: screen.sectionId },
      order: [['displayOrder', 'DESC']],
    })
    if (lastScreen && lastScreen.id === screenId) {
      await application.update({
        ...application,
        completed: [...(application.completed ?? []), screen.sectionId],
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
    }
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
}
