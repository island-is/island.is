import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { FormApplicantType } from '../formApplicantTypes/models/formApplicantType.model'
import { Screen } from '../screens/models/screen.model'
import { Organization } from '../organizations/models/organization.model'
import { Section } from '../sections/models/section.model'
import { FormsController } from './forms.controller'
import { FormsService } from './forms.service'
import { Form } from './models/form.model'
// import { ListItemMapper } from '../listItems/models/listItem.mapper'
import { ListItem } from '../listItems/models/listItem.model'
import { OrganizationUrl } from '../organizationUrls/models/organizationUrl.model'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Form,
      FormApplicantType,
      Section,
      Screen,
      Organization,
      ListItem,
      OrganizationUrl,
    ]),
  ],
  controllers: [FormsController],
  providers: [FormsService],
  // exports: [FormsService],
})
export class FormsModule {}
