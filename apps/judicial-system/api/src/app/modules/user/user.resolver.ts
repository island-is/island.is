import { Inject, UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'
import {
  CurrentGraphQlUser,
  JwtGraphQlAuthGuard,
} from '@island.is/judicial-system/auth'
import type { User as TUser } from '@island.is/judicial-system/types'

import { BackendApi } from '../../data-sources'
import { CreateUserInput } from './dto/createUser.input'
import { UpdateUserInput } from './dto/updateUser.input'
import { UserQueryInput } from './dto/user.input'
import { UsersQueryInput } from './dto/users.input'
import { User } from './user.model'

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @UseGuards(JwtGraphQlAuthGuard)
  @Query(() => [User], { nullable: true })
  users(
    @CurrentGraphQlUser() user: TUser,
    @Context('dataSources') { backendApi }: { backendApi: BackendApi },
    @Args('input', { type: () => UsersQueryInput, nullable: true })
    input?: UsersQueryInput,
  ): Promise<User[]> {
    this.logger.debug('Getting all users')

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_USERS,
      backendApi.getUsers().then((users) => {
        if (!input?.role) {
          return users
        }

        return users.filter((user) => input.role?.includes(user.role))
      }),
      (users: TUser[]) => users.map((user) => user.id),
    )
  }

  @UseGuards(JwtGraphQlAuthGuard)
  @Query(() => User, { nullable: true })
  async user(
    @Args('input', { type: () => UserQueryInput })
    input: UserQueryInput,
    @CurrentGraphQlUser() user: TUser,
    @Context('dataSources') { backendApi }: { backendApi: BackendApi },
  ): Promise<User | undefined> {
    this.logger.debug(`Getting user ${input.id}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_USER,
      backendApi.getUser(input.id),
      (user: TUser) => user.id,
    )
  }

  @UseGuards(new JwtGraphQlAuthGuard(true))
  @Query(() => User, { nullable: true })
  async currentUser(
    @CurrentGraphQlUser() user: TUser,
  ): Promise<User | undefined> {
    this.logger.debug('Getting current user')

    return user as User
  }

  @UseGuards(JwtGraphQlAuthGuard)
  @Mutation(() => User, { nullable: true })
  createUser(
    @Args('input', { type: () => CreateUserInput })
    input: CreateUserInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendApi },
  ): Promise<User> {
    this.logger.debug('Creating user')

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_USER,
      backendApi.createUser(input),
      (theUser) => theUser.id,
    )
  }

  @UseGuards(JwtGraphQlAuthGuard)
  @Mutation(() => User, { nullable: true })
  updateUser(
    @Args('input', { type: () => UpdateUserInput })
    input: UpdateUserInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendApi },
  ): Promise<User> {
    const { id, ...updateUser } = input

    this.logger.debug(`Updating user ${id}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_USER,
      backendApi.updateUser(id, updateUser),
      id,
    )
  }
}
