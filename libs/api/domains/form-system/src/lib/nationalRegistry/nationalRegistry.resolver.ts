import {
  CurrentUser,
  IdsUserGuard,
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
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { FormSystemNameByNationalId } from '../../models/nationalRegistryName.model'
import { FormSystemHomeByNationalId } from '../../models/nationalRegistryHome.model'
import { Audit } from '@island.is/nest/audit'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
@Audit({ namespace: '@island.is/api/form-system/national-registry' })
export class NationalRegistryResolver {
  constructor(private readonly service: NationalRegistryV3ClientService) {}

  @Audit()
  @Query(() => FormSystemNameByNationalId, {
    name: 'formSystemNameByNationalId',
    nullable: true,
  })
  async getName(
    @Args('input', { type: () => String }) input: string,
    @CurrentUser() user: User,
  ): Promise<FormSystemNameByNationalId | null> {
    const normalized = input.replace(/\D/g, '')
    if (!this.isValidNationalId(normalized)) {
      throw new BadRequestException('Invalid national id format')
    }
    const normalizedActorId = user?.nationalId?.replace(/\D/g, '')
    if (!normalizedActorId || normalizedActorId !== normalized) {
      throw new ForbiddenException('Not authorized to query this national id')
    }
    return this.service.getName(normalized)
  }

  @Audit()
  @Query(() => FormSystemHomeByNationalId, {
    name: 'formSystemHomeByNationalId',
    nullable: true,
  })
  async getAddress(
    @Args('input', { type: () => String }) input: string,
    @CurrentUser() user: User,
  ): Promise<FormSystemHomeByNationalId | null> {
    const normalized = input.replace(/\D/g, '')
    if (!this.isValidNationalId(normalized)) {
      throw new BadRequestException('Invalid national id format')
    }
    const normalizedActorId = user?.nationalId?.replace(/\D/g, '')
    if (!normalizedActorId || normalizedActorId !== normalized) {
      throw new ForbiddenException('Not authorized to query this national id')
    }
    return this.service.getHousing(normalized)
  }

  private isValidNationalId(id: string): boolean {
    return /^\d{10}$/.test(id)
  }
}
