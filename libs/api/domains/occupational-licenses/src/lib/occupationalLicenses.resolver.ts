import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { OccupationalLicensesClientService } from '@island.is/clients/occupational-licenses'
import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { OccupationalLicense } from './models/occupationalLicenses.model'

@UseGuards(IdsUserGuard, IdsAuthGuard)
@Resolver()
export class OccupationalLicensesResolver {
  constructor(
    private readonly occupationalLicensesApi: OccupationalLicensesClientService,
  ) {}

  @Query(() => [OccupationalLicense], {
    name: 'occupationalLicenses',
    nullable: true,
  })
  @Audit()
  async occupationalLicenses(@CurrentUser() user: User) {
    return await this.occupationalLicensesApi.getOccupationalLicense(user)
  }
}
