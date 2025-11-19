import {
  IdsUserGuard,
  CurrentUser,
  type User,
} from '@island.is/auth-nest-tools'
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
    @CurrentUser() user: User,
  ): Promise<CompanyExtendedInfo | null> {
    const normalized = input.replace(/\D/g, '')
    if (!this.isValidCompanyId(normalized)) {
      throw new BadRequestException('Invalid national id format')
    }

    const actorCompanyId = user?.nationalId
    const normalizedActorId = actorCompanyId?.replace(/\D/g, '')
    if (!normalizedActorId || normalizedActorId !== normalized) {
      throw new ForbiddenException('Not authorized to query this company')
    }

    return this.service.getCompany(input)
  }
}
