import { IdsUserGuard, CurrentUser } from '@island.is/auth-nest-tools'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import {
  UseGuards,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'
import { CompanyExtendedInfo } from '../../models/company.model'

type CurrentUser = {
  actor?: {
    nationalId?: string | null
  } | null
}

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class CompanyRegistryResolver {
  constructor(private readonly service: CompanyRegistryClientService) {}

  private isValidCompanyId(id: string): boolean {
    return /^\d{10}$/.test(id)
  }

  @Query(() => CompanyExtendedInfo, {
    name: 'formSystemCompanyByNationalId',
    nullable: true,
  })
  async getCompany(
    @Args('input', { type: () => String }) input: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<CompanyExtendedInfo | null> {
    if (!this.isValidCompanyId(input)) {
      throw new BadRequestException('Invalid national id format')
    }

    const actorCompanyId = user?.actor?.nationalId
    if (!actorCompanyId || actorCompanyId !== input) {
      throw new ForbiddenException('Not authorized to query this company')
    }

    return this.service.getCompany(input)
  }
}
