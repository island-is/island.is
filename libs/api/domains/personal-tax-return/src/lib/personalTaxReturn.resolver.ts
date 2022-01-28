import { CurrentUser, IdsUserGuard, User } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'
import { PersonalTaxReturnService } from './personalTaxReturn.service'
import { Query } from '@nestjs/graphql'

@UseGuards(IdsUserGuard)
@Audit({ namespace: '@island.is/api/personal-tax-return' })
export class PersonalTaxReturnResolver {
  constructor(private personalTaxReturnService: PersonalTaxReturnService) {}

  @Query(() => String, {
    nullable: true,
  })
  async personalTaxReturnForYearPdf(
    @CurrentUser() user: User,
  ): Promise<string> {
    console.log('personal tax return resolver')
    return await this.personalTaxReturnService.personalTaxReturnPdf(
      user.nationalId,
      '2020',
    )
  }
}
