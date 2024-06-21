import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { FormApplicant } from '../applicants/models/formApplicant.model'
import { Group } from '../groups/models/group.model'
import { InputSettingsMapper } from '../inputSettings/models/inputSettings.mapper'
import { InputType } from '../inputs/models/inputType.model'
import { ListType } from '../lists/models/listType.model'
import { Organization } from '../organizations/models/organization.model'
import { Step } from '../steps/models/step.model'
import { TestimonyType } from '../testimonies/models/testimonyType.model'
import { FormsController } from './forms.controller'
import { FormsService } from './forms.service'
import { Form } from './models/form.model'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Form,
      FormApplicant,
      Step,
      Group,
      Organization,
      InputType,
      TestimonyType,
      ListType,
    ]),
  ],
  controllers: [FormsController],
  providers: [FormsService, InputSettingsMapper],
})
export class FormsModule {}
