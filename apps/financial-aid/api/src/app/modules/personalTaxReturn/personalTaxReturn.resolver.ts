import { CurrentUser, IdsUserGuard, User } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'
import { PersonalTaxReturnService } from './personalTaxReturn.service'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { PersonalTaxReturnPdfInput } from './dto/personalTaxReturnPdf.input'
import { PersonalTaxReturn } from './models/personalTaxReturnPdf.response'

@UseGuards(IdsUserGuard)
@Audit({ namespace: '@island.is/api/personal-tax-return' })
@Resolver(() => PersonalTaxReturn)
export class PersonalTaxReturnResolver {
  constructor(private personalTaxReturnService: PersonalTaxReturnService) {}

  @Query(() => PersonalTaxReturn, {
    nullable: true,
  })
  async personalTaxReturnForYearPdf(
    @Args('input', { type: () => PersonalTaxReturnPdfInput })
    input: PersonalTaxReturnPdfInput,
    @CurrentUser() user: User,
  ): Promise<PersonalTaxReturn> {
    console.log('personal tax return resolver')
    const response = await this.personalTaxReturnService.personalTaxReturnPdf(
      '2809783969',
      '2020',
      input.uploadUrl,
      input.folder,
    )
    return { url: response }
  }
}
