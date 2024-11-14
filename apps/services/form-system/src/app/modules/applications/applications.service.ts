import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Application } from './models/application.model'
import { ApplicationDto } from './models/dto/application.dto'
import { Form } from '../forms/models/form.model'
import { Section } from '../sections/models/section.model'
// import { FieldSettings } from '../fieldSettings/models/fieldSettings.model'
import { ListItem } from '../listItems/models/listItem.model'
import { Field } from '../fields/models/field.model'
import { Screen } from '../screens/models/screen.model'
import { ApplicationMapper } from './models/application.mapper'
import { Value } from '../values/models/value.model'
// import { ValueFactory } from '../../dataTypes/valueTypes/valueType.factory'
import { ValueTypeFactory } from '../../dataTypes/valueTypes/valueType.factory'
import { ValueType } from '../../dataTypes/valueTypes/valueType.model'
import { CreateApplicationDto } from './models/dto/createApplication.dto'
// import { BaseValueType } from '../../dataTypes/valueTypes/baseValueType.interface'
// import { TextboxValue } from '../../dataTypes/valueTypes/models/textbox.valuetype'

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application)
    private readonly applicationModel: typeof Application,
    @InjectModel(Value)
    private readonly valueModel: typeof Value,
    @InjectModel(Form)
    private readonly formModel: typeof Form,
    private readonly applicationMapper: ApplicationMapper,
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
      isTest: createApplicationDto.isTest,
      dependencies: form.dependencies,
    } as Application)

    form.sections.map((section) => {
      section.screens?.map((screen) => {
        screen.fields?.map(async (field) => {
          await this.valueModel.create({
            fieldId: field.id,
            applicationId: newApplication.id,
            json: this.createValue(field.fieldType),
            // isHidden: field.isHidden,
          } as Value)
        })
      })
    })

    const applicationDto = await this.getApplication(newApplication.id)

    return applicationDto
  }

  private createValue(type: string) {
    const value = ValueTypeFactory.getClass(type, new ValueType())
    // const value = new ValueClass(order)
    return value
  }
  // private createValue(type: string, order: number) {
  //   const ValueClass = ValueFactory.getClass(type)
  //   const value = new ValueClass(order)
  //   return value
  // }

  async getApplication(applicationId: string): Promise<ApplicationDto> {
    const application = await this.applicationModel.findByPk(applicationId)

    if (!application) {
      throw new NotFoundException(
        `Application with id '${applicationId}' not found`,
      )
    }

    const form = await this.getApplicationForm(
      application.formId,
      applicationId,
    )

    // console.log(JSON.stringify(form, null, 2))
    const applicationDto = this.applicationMapper.mapFormToApplicationDto(
      form,
      application,
    )

    // const j = await this.valueModel.findByPk(
    //   '0c98264f-b460-483d-ab1e-4a8eb0d92072',
    // )

    // if (j) {
    //   const k: BaseValueType = j.json as BaseValueType
    //   const h: TextboxValue = k
    //   console.log(h)
    // }

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
                      where: { applicationId: applicationId },
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
