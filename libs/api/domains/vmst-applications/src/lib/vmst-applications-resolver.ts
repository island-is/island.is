import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import { VMSTApplicationsService } from './vmst-applications-service'
import { VmstApplicationsBankInformationInput } from './dto/bankInformationInput.input'
import { ValidationUnemploymentApplication } from './models'
import { VmstApplicationsVacationValidationInput } from './dto/vacationValidation.input'

@UseGuards(IdsUserGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/vmst-applications' })
export class VMSTApplicationsResolver {
  constructor(
    private readonly vmstApplicationsService: VMSTApplicationsService,
  ) {}

  @Query(() => Boolean, {
    name: 'vmstApplicationsAccountNumberValidation',
  })
  @Audit()
  async validateBankInformation(
    @CurrentUser() auth: User,
    @Args('input', {
      type: () => VmstApplicationsBankInformationInput,
    })
    input: VmstApplicationsBankInformationInput,
  ) {
    return this.vmstApplicationsService.validateBankInformation(auth, input)
  }

  @Query(() => ValidationUnemploymentApplication, {
    name: 'vmstApplicationsAccountNumberValidationUnemploymentApplication',
  })
  @Audit()
  async validateBankInformationUnemploymentApplication(
    @CurrentUser() auth: User,
    @Args('input', {
      type: () => VmstApplicationsBankInformationInput,
    })
    input: VmstApplicationsBankInformationInput,
  ) {
    return this.vmstApplicationsService.validateBankInformationUnemploymentApplication(
      auth,
      input,
    )
  }

  @Query(() => ValidationUnemploymentApplication, {
    name: 'vmstApplicationsVacationValidationUnemploymentApplication',
  })
  @Audit()
  async validateVacationDays(
    @CurrentUser() auth: User,
    @Args('input', {
      type: () => VmstApplicationsVacationValidationInput,
    })
    input: VmstApplicationsVacationValidationInput,
  ) {
    return this.vmstApplicationsService.validateVacationDays(auth, input)
  }
}
