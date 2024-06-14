import { Module } from '@nestjs/common'
import { FormsController } from './forms.controller'
import { FormsService } from './forms.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Form } from './models/form.model'
import { FormApplicant } from '../applicants/models/formApplicant.model'
import { StepsService } from '../steps/steps.service'
import { Step } from '../steps/models/step.model'
import { Group } from '../groups/models/group.model'
import { Organization } from '../organizations/models/organization.model'
import { InputType } from '../inputs/models/inputType.model'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Form,
      FormApplicant,
      Step,
      Group,
      Organization,
      InputType,
    ]),
  ],
  controllers: [FormsController],
  providers: [FormsService],
})
export class FormsModule {}
