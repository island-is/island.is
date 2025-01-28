import { Query, Resolver, ResolveField, Parent } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import { DrivingLicenseService } from '../drivingLicense.service'
export * from '@island.is/nest/audit'
import { QualitySignature } from './models'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Resolver(QualitySignature)
export class QualitySignatureResolver {
  constructor(private readonly drivingLicenseService: DrivingLicenseService) {}

  @ResolveField('dataUri', () => String, { nullable: true })
  resolveDataUri(
    @Parent() { hasQualitySignature }: QualitySignature,
    @CurrentUser() user: User,
  ): Promise<string | null> {
    return hasQualitySignature
      ? this.drivingLicenseService.getQualitySignatureUri(user.authorization)
      : Promise.resolve(null)
  }

  @Query(() => QualitySignature)
  drivingLicenseQualitySignature(@CurrentUser() user: User) {
    return this.drivingLicenseService.getQualitySignature(user.authorization)
  }
}
