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
  CurrentGraphQlUserNationalId,
  JwtGraphQlAuthGuard,
  JwtGraphQlAuthUserGuard,
} from '@island.is/judicial-system/auth'
import type { User as TUser } from '@island.is/judicial-system/types'

import { BackendService } from '../backend'
import { CreateUserInput } from './dto/createUser.input'
import { UpdateUserInput } from './dto/updateUser.input'
import { UserQueryInput } from './dto/user.input'
import { UsersQueryInput } from './dto/users.input'
import { CurrentUserResponse } from './models/currentUser.response'
import { User } from './models/user.model'

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @UseGuards(JwtGraphQlAuthUserGuard)
  @Query(() => [User], { nullable: true })
  users(
    @CurrentGraphQlUser() user: TUser,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
    @Args('input', { type: () => UsersQueryInput, nullable: true })
    input?: UsersQueryInput,
  ): Promise<User[]> {
    this.logger.debug('Getting all users')

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_USERS,
      backendService.getUsers().then((users) => {
        if (!input?.role) {
          return users
        }

        return users.filter((user) => input.role?.includes(user.role))
      }),
      (users: User[]) => users.map((user) => user.id),
    )
  }

  @UseGuards(JwtGraphQlAuthUserGuard)
  @Query(() => User, { nullable: true })
  user(
    @Args('input', { type: () => UserQueryInput })
    input: UserQueryInput,
    @CurrentGraphQlUser() user: TUser,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<User | undefined> {
    this.logger.debug(`Getting user ${input.id}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.GET_USER,
      backendService.getUser(input.id),
      (user: User) => user.id,
    )
  }

  @UseGuards(JwtGraphQlAuthGuard)
  @Query(() => CurrentUserResponse, { nullable: true })
  async currentUser(
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
    @CurrentGraphQlUserNationalId() nationalId: string,
    @CurrentGraphQlUser() user?: TUser,
  ): Promise<CurrentUserResponse | undefined> {
    this.logger.debug('Getting current user')

    let eligibleUsers: User[]

    try {
      eligibleUsers = await backendService.findUsersByNationalId(nationalId)
    } catch (error) {
      if (!(error?.problem?.status === 404 && user)) {
        this.logger.error('No eligible users', { error })

        throw error
      }

      eligibleUsers = [user]
    }

    return { user, eligibleUsers }
  }

  @UseGuards(JwtGraphQlAuthUserGuard)
  @Mutation(() => User, { nullable: true })
  createUser(
    @Args('input', { type: () => CreateUserInput })
    input: CreateUserInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<User> {
    this.logger.debug('Creating user')

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.CREATE_USER,
      backendService.createUser(input),
      (theUser) => theUser.id,
    )
  }

  @UseGuards(JwtGraphQlAuthUserGuard)
  @Mutation(() => User, { nullable: true })
  updateUser(
    @Args('input', { type: () => UpdateUserInput })
    input: UpdateUserInput,
    @CurrentGraphQlUser() user: User,
    @Context('dataSources')
    { backendService }: { backendService: BackendService },
  ): Promise<User> {
    const { id, ...updateUser } = input

    this.logger.debug(`Updating user ${id}`)

    return this.auditTrailService.audit(
      user.id,
      AuditedAction.UPDATE_USER,
      backendService.updateUser(id, updateUser),
      id,
    )
  }
}
