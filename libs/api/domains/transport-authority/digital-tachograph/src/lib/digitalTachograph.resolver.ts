import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class DigitalTachographApiResolver {
  constructor() {}
}
