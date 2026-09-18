import { UseGuards } from '@nestjs/common'
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'

import { Identity } from '@island.is/api/domains/identity'
import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import type { DelegationRequestDTO } from '@island.is/clients/auth/delegation-api'
import { IdentityClientService } from '@island.is/clients/identity'

import { CreateDelegationRequestInput } from '../dto/createDelegationRequest.input'
import {
  DelegationRequestInput,
  FulfillDelegationRequestInput,
} from '../dto/delegationRequest.input'
import { DelegationRequest } from '../models/delegationRequest.model'
import { DelegationRequestsService } from '../services/delegationRequests.service'

@UseGuards(IdsUserGuard)
@Resolver(() => DelegationRequest)
export class DelegationRequestResolver {
  constructor(
    private delegationRequestsService: DelegationRequestsService,
    private identityService: IdentityClientService,
  ) {}

  @Query(() => [DelegationRequest], {
    name: 'authDelegationRequestsOutgoing',
  })
  getOutgoing(@CurrentUser() user: User): Promise<DelegationRequestDTO[]> {
    return this.delegationRequestsService.getOutgoing(user)
  }

  @Query(() => [DelegationRequest], {
    name: 'authDelegationRequestsIncoming',
  })
  getIncoming(@CurrentUser() user: User): Promise<DelegationRequestDTO[]> {
    return this.delegationRequestsService.getIncoming(user)
  }

  @Query(() => DelegationRequest, { name: 'authDelegationRequest' })
  getById(
    @CurrentUser() user: User,
    @Args('input', { type: () => DelegationRequestInput })
    input: DelegationRequestInput,
  ): Promise<DelegationRequestDTO> {
    return this.delegationRequestsService.getById(user, input.requestId)
  }

  @Mutation(() => DelegationRequest, { name: 'createAuthDelegationRequest' })
  create(
    @CurrentUser() user: User,
    @Args('input', { type: () => CreateDelegationRequestInput })
    input: CreateDelegationRequestInput,
  ): Promise<DelegationRequestDTO> {
    return this.delegationRequestsService.create(user, input)
  }

  @Mutation(() => DelegationRequest, { name: 'rejectAuthDelegationRequest' })
  reject(
    @CurrentUser() user: User,
    @Args('input', { type: () => DelegationRequestInput })
    input: DelegationRequestInput,
  ): Promise<DelegationRequestDTO> {
    return this.delegationRequestsService.reject(user, input.requestId)
  }

  @Mutation(() => DelegationRequest, { name: 'cancelAuthDelegationRequest' })
  cancel(
    @CurrentUser() user: User,
    @Args('input', { type: () => DelegationRequestInput })
    input: DelegationRequestInput,
  ): Promise<DelegationRequestDTO> {
    return this.delegationRequestsService.cancel(user, input.requestId)
  }

  @Mutation(() => DelegationRequest, { name: 'fulfillAuthDelegationRequest' })
  fulfill(
    @CurrentUser() user: User,
    @Args('input', { type: () => FulfillDelegationRequestInput })
    input: FulfillDelegationRequestInput,
  ): Promise<DelegationRequestDTO> {
    return this.delegationRequestsService.fulfill(
      user,
      input.requestId,
      input.delegationId,
    )
  }

  @ResolveField('from', () => Identity)
  resolveFrom(@Parent() request: DelegationRequestDTO): Promise<Identity> {
    return this.identityService.getIdentityWithFallback(
      request.fromNationalId,
      {},
    )
  }

  @ResolveField('to', () => Identity)
  resolveTo(@Parent() request: DelegationRequestDTO): Promise<Identity> {
    return this.identityService.getIdentityWithFallback(request.toNationalId, {})
  }
}
