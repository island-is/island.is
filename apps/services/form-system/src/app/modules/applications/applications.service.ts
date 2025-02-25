import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
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
import { ApplicationStatus } from '../../enums/applicationStatus'
import { Organization } from '../organizations/models/organization.model'
import { ServiceManager } from '../services/service.manager'
import { ApplicationEvent } from './models/applicationEvent.model'
import { ApplicationEvents } from '../../enums/applicationEvents'
import { ApplicationListDto } from './models/dto/applicationList.dto'
import { FieldTypesEnum } from '../../dataTypes/fieldTypes/fieldTypes.enum'
import { ScreenValidationResponse } from '../../dataTypes/validationResponse.model'
import { User } from '@island.is/auth-nest-tools'
import { Applicant } from '../applicants/models/applicant.model'
import { ApplicantTypesEnum } from '../../dataTypes/applicantTypes/applicantTypes.enum'
import { FormApplicantType } from '../formApplicantTypes/models/formApplicantType.model'
import { FormCertificationType } from '../formCertificationTypes/models/formCertificationType.model'

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application)
    private readonly applicationModel: typeof Application,
    @InjectModel(Applicant)
    private readonly applicantModel: typeof Applicant,
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

  async create(
    slug: string,
    createApplicationDto: CreateApplicationDto,
    user: User,
  ): Promise<ApplicationDto> {
    const form: Form = await this.getForm(slug)

    if (!form) {
      throw new NotFoundException(`Form with slug '${slug}' not found`)
    }

    let newApplicationId = ''

    await this.sequelize.transaction(async (transaction) => {
      const newApplication: Application = await this.applicationModel.create(
        {
          formId: form.id,
          organizationId: form.organizationId,
          isTest: createApplicationDto.isTest,
          dependencies: form.dependencies,
          status: ApplicationStatus.IN_PROGRESS,
        } as Application,
        { transaction },
      )

      await this.applicantModel.create(
        {
          nationalId: user.nationalId,
          applicationId: newApplication.id,
          applicantTypeId: ApplicantTypesEnum.INDIVIDUAL,
          lastLogin: new Date(),
        } as Applicant,
        { transaction },
      )

      await this.applicationEventModel.create(
        {
          eventType: ApplicationEvents.APPLICATION_CREATED,
          applicationId: newApplication.id,
        } as ApplicationEvent,
        { transaction },
      )

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
      throw new NotFoundException(`Application with id '${id}' not found`)
    }

    application.submittedAt = new Date()
    await application.save()

    const applicationDto = await this.getApplication(id)

    const success = await this.serviceManager.send(applicationDto)

    if (success) {
      application.status = ApplicationStatus.SUBMITTED
      application.submittedAt = new Date()
      await application.save()
    }

    return success
  }

  async findAllByOrganization(
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

  // Hér þarf að sækja allar umsóknir eftir tegund og notanda
  // Ef notandi er í umboði lögaðila þá þarf að sækja allar þesskonar umsóknir þess lögaðila
  async findAllByTypeAndUser(
    formId: string,
    page: number,
    limit: number,
    isTest: boolean,
  ) {
    return new ApplicationListDto()
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
        {
          model: FormApplicantType,
          as: 'formApplicantTypes',
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
}
