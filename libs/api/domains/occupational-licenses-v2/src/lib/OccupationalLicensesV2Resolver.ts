import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { RettindiFyrirIslandIsApi } from '@island.is/clients/district-commissioners-licenses'

@UseGuards(IdsUserGuard, IdsAuthGuard)
@Scopes(ApiScope.internal)
@Resolver()
export class OccupationalLicensesV2Resolver {
  constructor(private readonly api: RettindiFyrirIslandIsApi) {}

  @Query(() => OccupationalLicensesList, {
    name: 'occupationalLicenses',
    nullable: true,
  })
  @Audit()
  async occupationalLicenses(@CurrentUser() user: User) {
    return await this.occupationalLicensesApi.getOccupationalLicenses(user)
  }
}
