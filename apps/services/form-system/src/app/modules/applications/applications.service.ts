import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Application } from './models/application.model'
import { ApplicationDto } from './models/dto/application.dto'
import { Form } from '../forms/models/form.model'
import { Section } from '../sections/models/section.model'
import { ListItem } from '../listItems/models/listItem.model'
import { Field } from '../fields/models/field.model'
import { Screen } from '../screens/models/screen.model'
import { ApplicationMapper } from './models/application.mapper'
import { Value } from '../values/models/value.model'
import { ValueTypeFactory } from '../../dataTypes/valueTypes/valueType.factory'
import { ValueType } from '../../dataTypes/valueTypes/valueType.model'
import { CreateApplicationDto } from './models/dto/createApplication.dto'
import { UpdateApplicationDto } from './models/dto/updateApplication.dto'
import { ApplicationStatus } from '../../enums/applicationStatus'
import { Organization } from '../organizations/models/organization.model'
import { ServiceManager } from '../services/service.manager'
import { ApplicationEvent } from './models/applicationEvent.model'
import { ApplicationEvents } from '../../enums/applicationEvents'
import { ApplicationListDto } from './models/dto/applicationList.dto'
import { FieldTypesEnum } from '../../dataTypes/fieldTypes/fieldTypes.enum'
import { ScreenDto } from '../screens/models/dto/screen.dto'
import { ScreenValidationResponse } from '../../dataTypes/validationResponse.model'

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
  ) {}

  async create(
    slug: string,
    createApplicationDto: CreateApplicationDto,
  ): Promise<ApplicationDto> {
    const form: Form = await this.getForm(slug)

    if (!form) {
      throw new NotFoundException(`Form with slug '${slug}' not found`)
    }

    const newApplication: Application = await this.applicationModel.create({
      formId: form.id,
      organizationId: form.organizationId,
      isTest: createApplicationDto.isTest,
      dependencies: form.dependencies,
      status: ApplicationStatus.IN_PROGRESS,
    } as Application)

    await this.applicationEventModel.create({
      eventType: ApplicationEvents.APPLICATION_CREATED,
      applicationId: newApplication.id,
    } as ApplicationEvent)

    await Promise.all(
      form.sections.map((section) =>
        Promise.all(
          section.screens?.map((screen) =>
            Promise.all(
              screen.fields?.map(async (field) => {
                return this.valueModel.create({
                  fieldId: field.id,
                  fieldType: field.fieldType,
                  applicationId: newApplication.id,
                  json: ValueTypeFactory.getClass(
                    field.fieldType,
                    new ValueType(),
                  ),
                } as Value)
              }) || [],
            ),
          ) || [],
        ),
      ),
    )

    const applicationDto = await this.getApplication(newApplication.id)

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

  async validateScreen(
    screenId: string,
    applicationDto: ApplicationDto,
  ): Promise<ScreenValidationResponse> {
    const screenValidationResponse: ScreenValidationResponse =
      new ScreenValidationResponse()

    return screenValidationResponse
  }

  async submit(id: string): Promise<boolean> {
    const application = await this.applicationModel.findByPk(id)

    if (!application) {
      throw new NotFoundException(`Application with id '${id}' not found`)
    }

    application.submittedAt = new Date()
    application.save()

    const applicationDto = await this.getApplication(id)

    const success = await this.serviceManager.send(applicationDto)

    if (success) {
      application.status = ApplicationStatus.SUBMITTED
      application.submittedAt = new Date()
      application.save()
    }

    return success
  }

  async findAll(
    organizationId: string,
    page: number,
    limit: number,
    isTest: boolean,
  ): Promise<ApplicationListDto> {
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

    const applicationList = new ApplicationListDto()
    applicationList.applications = applicationMinimalDtos
    applicationList.total = total
    return applicationList
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

    // console.log(JSON.stringify(form, null, 2))

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
}
