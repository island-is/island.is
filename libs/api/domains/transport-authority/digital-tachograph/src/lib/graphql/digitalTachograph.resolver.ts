import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { QualityPhotoAndSignature } from './models'
import { DigitalTachographApi } from '../digitalTachograph.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver()
export class DigitalTachographApiResolver {
  constructor(private readonly digitalTachographApi: DigitalTachographApi) {}

  @Query(() => QualityPhotoAndSignature)
  digitalTachographQualityPhotoAndSignature(@CurrentUser() user: User) {
    return this.digitalTachographApi.getPhotoAndSignature(user.nationalId)
  }
}
