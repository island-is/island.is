import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'
import { CompanyExtendedInfo } from '../../models/company.model'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class CompanyRegistryResolver {
  constructor(private readonly service: CompanyRegistryClientService) {}

  @Query(() => CompanyExtendedInfo, {
    name: 'formSystemCompanyByNationalId',
    nullable: true,
  })
  async getCompany(
    @Args('input', { type: () => String }) input: string,
  ): Promise<CompanyExtendedInfo | null> {
    return this.service.getCompany(input)
  }
}
