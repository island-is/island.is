import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { PMarkService } from '../pMark.service'
export * from '@island.is/nest/audit'
import { Juristiction, QualityPhoto } from './models'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(private readonly PMarkService: PMarkService) {}

  @Query(() => [Juristiction])
  drivingLicenseListOfJuristictions() {
    return this.PMarkService.getListOfJuristictions()
  }

  @Query(() => QualityPhoto)
  qualityPhoto(@CurrentUser() user: User) {
    return this.PMarkService.getQualityPhoto(user.nationalId)
  }
}
