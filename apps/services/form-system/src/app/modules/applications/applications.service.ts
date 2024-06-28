import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Application } from './models/application.model'
import { ApplicationDto } from './models/dto/application.dto'
import { Form } from '../forms/models/form.model'
import { FormsService } from '../forms/forms.service'
import { FormDto } from '../forms/models/dto/form.dto'
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

  async create(formUrlName: string): Promise<ApplicationDto> {
    const form: Form = await this.getForm(formUrlName)

    const applicationDto = this.applicationMapper.mapFormToApplicationDto(form)
    return applicationDto
  }

  getPreview(formId: string): ApplicationDto {
    return new ApplicationDto()
  }

  private async getForm(urlName: string): Promise<Form> {
    console.log('urlName', urlName)
    const form = await this.formModel.findOne({
      where: { urlName: urlName },
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
    })

    if (!form) {
      throw new NotFoundException(`Form with urlName '${urlName}' not found`)
    }

    return form
  }
}
