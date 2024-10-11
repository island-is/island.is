import { Module } from '@nestjs/common'
import { FormSystemClientModule } from '@island.is/clients/form-system'
import { FormsService } from './forms/forms.service'
import { FormsResolver } from './forms/forms.resolver'
import { GroupsService } from './groups/groups.service'
import { GroupsResolver } from './groups/groups.resolver'
import { InputsService } from './inputs/inputs.service'
import { InputsResolver } from './inputs/inputs.resolver'
import { OrganizationsService } from './organizations/organizations.services'
import { OrganizationsResolver } from './organizations/organizations.resolver'
import { FormSystemService } from './services/services.service'
import { FormSystemServicesResolver } from './services/services.resolver'
import { StepsService } from './steps/steps.service'
import { StepsResolver } from './steps/steps.resolver'

@Module({
  providers: [
    FormsService,
    FormsResolver,
    GroupsService,
    GroupsResolver,
    InputsService,
    InputsResolver,
    OrganizationsService,
    OrganizationsResolver,
    FormSystemService,
    FormSystemServicesResolver,
    StepsService,
    StepsResolver,
  ],
  exports: [],
  imports: [FormSystemClientModule],
})
export class FormSystemModule {}
