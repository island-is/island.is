import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Screen } from '../screens/models/screen.model'
import { Organization } from '../organizations/models/organization.model'
import { Section } from '../sections/models/section.model'
import { FormsController } from './forms.controller'
import { FormsService } from './forms.service'
import { Form } from './models/form.model'
import { ListItem } from '../listItems/models/listItem.model'
import { Field } from '../fields/models/field.model'
import { FormCertificationType } from '../formCertificationTypes/models/formCertificationType.model'
import { Application } from '../applications/models/application.model'
import { FileModule } from '../file/file.module'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Form,
      Application,
      FormCertificationType,
      Section,
      Screen,
      Field,
      Organization,
      ListItem,
    ]),
    FileModule,
  ],
  controllers: [FormsController],
  providers: [FormsService],
})
export class FormsModule {}
