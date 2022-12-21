import { Query, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { TransportAuthorityApi } from '../transportAuthority.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {}
