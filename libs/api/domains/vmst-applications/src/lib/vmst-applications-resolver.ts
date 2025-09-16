import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import { VMSTApplicationsService } from './vmst-applications-service'
import { VmstApplicationsBankInformationInput } from './dto/bankInformationInput.input'

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
}
