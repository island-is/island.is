import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { StudentTrackHistory } from '../models/studentTrackHistory.model'
import { UniversityCareersService } from '../universityCareers.service'
import { StudentInfoInput } from '../dto/studentInfo.input'
import { Locale } from '@island.is/shared/types'
import { AUDIT_NAMESPACE } from '../constants'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver(() => StudentTrackHistory)
@Audit({ namespace: AUDIT_NAMESPACE })
export class TrackHistoryResolver {
  constructor(private service: UniversityCareersService) {}

  @Query(() => StudentTrackHistory, {
    name: 'universityCareersStudentTrackHistory',
  })
  @Audit()
  async studentTrackHistory(
    @CurrentUser() user: User,
    @Args('input') input: StudentInfoInput,
  ): Promise<StudentTrackHistory | null> {
    return this.service.getStudentTrackHistory(user, input.locale as Locale)
  }
}
