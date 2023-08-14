import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { HealthDirectorateClientService } from '@island.is/clients/health-directorate'
import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { OccupationalLicense } from './models/occupationalLicense.model'

@UseGuards(IdsUserGuard, IdsAuthGuard)
@Resolver()
export class HealthDirectorateResolver {
  constructor(
    private readonly healthDirectorateApi: HealthDirectorateClientService,
  ) {}

  @Query(() => [OccupationalLicense], {
    name: 'healthDirectorateOccupationalLicenses',
    nullable: true,
  })
  @Audit()
  async occupationalLicenses(@CurrentUser() user: User) {
    return await this.healthDirectorateApi.getOccupationalLicense(user)
  }
}
