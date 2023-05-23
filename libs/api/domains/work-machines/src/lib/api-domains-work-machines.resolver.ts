import {
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
import { WorkMachinesService } from './api-domains-work-machines.service'
import { WorkMachineEntity } from './models/getWorkMachines.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/workMachines' })
export class WorkMachinesResolver {
  constructor(private readonly workMachinesService: WorkMachinesService) {}

  @Scopes(ApiScope.internal)
  @Query(() => WorkMachineEntity, { name: 'workMachines', nullable: true })
  @Audit()
  async getWorkMachines(@CurrentUser() user: User) {
    return this.workMachinesService.getWorkMachines(user)
  }
}
