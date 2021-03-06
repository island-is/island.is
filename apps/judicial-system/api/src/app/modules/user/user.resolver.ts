import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { User as TUser } from '@island.is/judicial-system/types'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthGuard,
} from '@island.is/judicial-system/auth'
import { AuditedAction } from '@island.is/judicial-system/audit-trail'

import { BackendAPI } from '../../../services'
import { AuditService } from '../audit'
import { CreateUserInput, UpdateUserInput, UserQueryInput } from './dto'
import { User } from './user.model'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => User)
export class UserResolver {
  constructor(
    @Inject(AuditService)
    private readonly auditService: AuditService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Query(() => [User], { nullable: true })
  users(
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<User[]> {
    this.logger.debug('Getting all users')

    return backendApi.getUsers()
  }

  @Query(() => User, { nullable: true })
  async user(
    @Args('input', { type: () => UserQueryInput })
    input: UserQueryInput,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<User | undefined> {
    this.logger.debug(`Getting user ${input.id}`)

    return backendApi.getUser(input.id)
  }

  @Query(() => User, { nullable: true })
  async currentUser(
    @CurrentGraphQlUser() user: TUser,
  ): Promise<User | undefined> {
    this.logger.debug('Getting current user')

    return user as User
  }

  @Mutation(() => User, { nullable: true })
  createUser(
    @Args('input', { type: () => CreateUserInput })
    input: CreateUserInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<User> {
    this.logger.debug('Creating user')

    return this.auditService.audit(
      user.id,
      AuditedAction.CREATE_USER,
      backendApi.createUser(input),
      (theUser) => theUser.id,
    )
  }

  @Mutation(() => User, { nullable: true })
  updateUser(
    @Args('input', { type: () => UpdateUserInput })
    input: UpdateUserInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<User> {
    const { id, ...updateUser } = input

    this.logger.debug(`Updating user ${id}`)

    return this.auditService.audit(
      user.id,
      AuditedAction.UPDATE_USER,
      backendApi.updateUser(id, updateUser),
      id,
    )
  }
}
