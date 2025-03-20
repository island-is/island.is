import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import { Args, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import { PracticalExamsService } from './practicalExams.service'
import { FeatureFlagGuard } from '@island.is/nest/feature-flags'
import { ValidateInstrutorInput } from './dto/validaInstructorInput.input'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/practical-exams' })
export class PracticalExamsResolver {
  constructor(private readonly practicalExamsService: PracticalExamsService) {}

  @Scopes(ApiScope.vinnueftirlitid)
  @Audit()
  async validateInstructor(
    @CurrentUser() auth: User,
    @Args('input', {
      type: () => ValidateInstrutorInput,
    })
    input: ValidateInstrutorInput,
  ) {
    return this.practicalExamsService.validateInstructor(auth, input)
  }
}
