import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { DentistService } from './dentist.service'
import { DentistRegistration } from './models/registration.model'
import { DentistBillsInput } from './dto/bills.input'
import { DentistStatus } from './models/status.model'
import { DentistRegisterInput } from './dto/register.input'
import { PaginatedDentistsResponse } from './models/dentist.model'
import { DentistsInput } from './dto/dentist.input'
import { DentistRegisterResponse } from './models/registerResponse.model'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard)
@Audit({ namespace: '@island.is/api/rights-portal/dentist' })
export class DentistResolver {
  constructor(private readonly service: DentistService) {}

  @Scopes(ApiScope.healthDentists, ApiScope.healthHealthcare)
  @Query(() => DentistRegistration, {
    name: 'rightsPortalUserDentistRegistration',
    nullable: true,
  })
  @Audit()
  getRightsPortalDentists(
    @CurrentUser() user: User,
    @Args({
      name: 'input',
      nullable: true,
    })
    input?: DentistBillsInput,
  ) {
    return this.service.getDentistRegistrations(
      user,
      input?.dateFrom,
      input?.dateTo,
    )
  }

  @Scopes(ApiScope.healthDentists)
  @Query(() => DentistStatus, {
    name: 'rightsPortalDentistStatus',
    nullable: true,
  })
  @Audit()
  getDentistStatus(@CurrentUser() user: User) {
    return this.service.getDentistStatus(user)
  }

  @Scopes(ApiScope.healthDentists)
  @Query(() => DentistStatus, {
    name: 'rightsPortalCurrentDentist',
    nullable: true,
  })
  @Audit()
  getCurrentDentist(@CurrentUser() user: User) {
    return this.service.getDentistStatus(user)
  }

  @Scopes(ApiScope.healthDentists)
  @Mutation(() => DentistRegisterResponse, {
    name: 'rightsPortalRegisterDentist',
  })
  @Audit()
  registerDentist(
    @CurrentUser() user: User,
    @Args('input') input: DentistRegisterInput,
  ) {
    return this.service.registerDentist(user, input.id)
  }

  @Scopes(ApiScope.healthDentists)
  @Query(() => PaginatedDentistsResponse, {
    name: 'rightsPortalPaginatedDentists',
    nullable: true,
  })
  @Audit()
  getRightsPortalDentistList(
    @CurrentUser() user: User,
    @Args('input') input: DentistsInput,
  ) {
    return this.service.getDentists(user, input)
  }
}
