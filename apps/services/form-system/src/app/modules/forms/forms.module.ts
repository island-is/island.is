import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { FormApplicant } from '../applicants/models/formApplicant.model'
import { Screen } from '../screens/models/screen.model'
import { FieldSettingsMapper } from '../fieldSettings/models/fieldSettings.mapper'
import { FieldType } from '../fields/models/fieldType.model'
import { ListType } from '../lists/models/listType.model'
import { Organization } from '../organizations/models/organization.model'
import { Section } from '../sections/models/section.model'
import { TestimonyType } from '../testimonies/models/testimonyType.model'
import { FormsController } from './forms.controller'
import { FormsService } from './forms.service'
import { Form } from './models/form.model'
import { ListItemMapper } from '../listItems/models/listItem.mapper'
import { ListItem } from '../listItems/models/listItem.model'
import { FormMapper } from './models/form.mapper'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Form,
      FormApplicant,
      Section,
      Screen,
      Organization,
      FieldType,
      TestimonyType,
      ListType,
      ListItem,
    ]),
  ],
  controllers: [FormsController],
  providers: [FormsService, FieldSettingsMapper, ListItemMapper, FormMapper],
})
export class FormsModule {}
