import { CurrentUser, IdsUserGuard, User } from '@island.is/auth-nest-tools'
import { Query, UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'
import { PersonalTaxReturnService } from './personalTaxReturn.service'

@UseGuards(IdsUserGuard)
@Audit({ namespace: '@island.is/api/personal-tax-return' })
export class PersonalTaxReturnResolver {
  constructor(private personalTaxReturnService: PersonalTaxReturnService) {}

  @Query(() => String, { nullable: true })
  async personalTaxReturnForYearInPdf(
    @CurrentUser() user: User,
  ): Promise<string | null> {
    return await this.personalTaxReturnService.personalTaxReturnPdf(
      user.nationalId,
      'year',
    )
  }
}
