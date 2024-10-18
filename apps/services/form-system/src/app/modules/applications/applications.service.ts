import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Application } from './models/application.model'
import { ApplicationDto } from './models/dto/application.dto'
import { Form } from '../forms/models/form.model'
import { Section } from '../sections/models/section.model'
import { FieldSettings } from '../fieldSettings/models/fieldSettings.model'
import { ListItem } from '../listItems/models/listItem.model'
import { Field } from '../fields/models/field.model'
import { Screen } from '../screens/models/screen.model'
import { ApplicationMapper } from './models/application.mapper'

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application)
    private readonly applicationModel: typeof Application,
    @InjectModel(Form)
    private readonly formModel: typeof Form,
    private readonly applicationMapper: ApplicationMapper,
  ) {}

  async create(slug: string): Promise<ApplicationDto> {
    const form: Form = await this.getForm(slug)

    const newApplication: Application = await this.applicationModel.create({
      formId: form.id,
    } as Application)

    const applicationDto = this.applicationMapper.mapFormToApplicationDto(
      form,
      newApplication,
    )
    return applicationDto
  }

  getPreview(formId: string): ApplicationDto {
    return new ApplicationDto()
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
