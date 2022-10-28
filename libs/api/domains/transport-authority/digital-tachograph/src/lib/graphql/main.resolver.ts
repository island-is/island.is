import { Args, Query, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { CheckTachoNetInput } from './dto'
import {
  QualityPhotoAndSignature,
  CheckTachoNetExists,
  NewestDriversCard,
} from './models'
import { DigitalTachographApi } from '../digitalTachograph.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver()
export class MainResolver {
  constructor(private readonly digitalTachographApi: DigitalTachographApi) {}

  @Query(() => CheckTachoNetExists)
  digitalTachographTachoNetExists(@Args('input') input: CheckTachoNetInput) {
    return this.digitalTachographApi.checkTachoNet(input)
  }

  @Query(() => NewestDriversCard)
  digitalTachographNewestDriversCard(@CurrentUser() user: User) {
    return this.digitalTachographApi.getNewestDriversCard(user.nationalId)
  }

  @Query(() => QualityPhotoAndSignature)
  digitalTachographQualityPhotoAndSignature(@CurrentUser() user: User) {
    return this.digitalTachographApi.getPhotoAndSignature(user.nationalId)
  }
}
