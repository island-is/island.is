import {
  Auth,
  AuthMiddleware,
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import { Query, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import { WorkMachineEntity } from './models/getWorkMachines.model'
import { DisabilityLicenseService } from '@island.is/clients/disability-license'
import { MachinesApi } from '@island.is/clients/work-machines'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/workMachines' })
export class WorkMachinesResolver {
  constructor(
    private readonly workMachinesService: MachinesApi,
    private readonly testApi: DisabilityLicenseService,
  ) {}

  @Scopes(ApiScope.internal)
  @Query(() => WorkMachineEntity, { name: 'workMachines', nullable: true })
  @Audit()
  async getWorkMachines(@CurrentUser() user: User) {
    return this.workMachinesService
      .withMiddleware(new AuthMiddleware(user as Auth))
      .apiMachinesGet({})
  }
}
