import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import { Resolver, Mutation, Args } from '@nestjs/graphql'
import type { User as AuthUser } from '@island.is/auth-nest-tools'

import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { FamilyCorrectionResponse } from '../shared/models'
import { FamilyCorrectionInput } from '../v1/dto/FamilyCorrectionInput.input'
import { SoffiaService } from '../v1/soffia.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.meDetails)
@Resolver()
@Audit({ namespace: '@island.is/api/national-registry' })
export class CorrectionResolver {
  constructor(private readonly soffiaService: SoffiaService) {}

  @Audit()
  @Mutation(() => FamilyCorrectionResponse, { nullable: true })
  async nationalRegistryChildCorrection(
    @Args('input') input: FamilyCorrectionInput,
    @CurrentUser() user: AuthUser,
  ): Promise<FamilyCorrectionResponse> {
    return this.soffiaService.postUserCorrection(input, user.nationalId)
  }
}
