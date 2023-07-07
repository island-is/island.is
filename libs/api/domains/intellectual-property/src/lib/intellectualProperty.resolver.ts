import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { IntellectualPropertyService } from './intellectualProperty.service'
import { Patent } from './models/getPatent.model'
import { IntellectualProperties } from './models/getIntellectualProperties.model'
import { Design } from './models/getDesign.model'
import { GetIntellectualPropertyInput } from './dto/getPatent.input'
import { Trademark } from './models/getTrademark.model'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard)
@Audit({ namespace: '@island.is/api/intellectual-property' })
export class IntellectualPropertyResolver {
  constructor(private readonly ipService: IntellectualPropertyService) {}

  @Scopes(ApiScope.internal)
  @Query(() => IntellectualProperties, {
    name: 'intellectualProperties',
    nullable: true,
  })
  @Audit()
  getIntellectualProperties(@CurrentUser() user: User) {
    return this.ipService.getIntellectualProperties(user)
  }

  @Scopes(ApiScope.internal)
  @Query(() => Patent, {
    name: 'intellectualPropertyPatent',
    nullable: true,
  })
  @Audit()
  getIntellectualPropertyPatentById(
    @Args('input', { type: () => GetIntellectualPropertyInput })
    input: GetIntellectualPropertyInput,
  ) {
    return this.ipService.getPatentByApplicationNumber(input.key)
  }

  @Scopes(ApiScope.internal)
  @Query(() => Design, {
    name: 'intellectualPropertyDesign',
    nullable: true,
  })
  @Audit()
  getIntellectualPropertyDesignById(
    @Args('input', { type: () => GetIntellectualPropertyInput })
    input: GetIntellectualPropertyInput,
  ) {
    return this.ipService.getDesignByHID(input.key)
  }

  @Scopes(ApiScope.internal)
  @Query(() => Trademark, {
    name: 'intellectualPropertyTrademark',
    nullable: true,
  })
  @Audit()
  getIntellectualPropertyTrademarkById(
    @Args('input', { type: () => GetIntellectualPropertyInput })
    input: GetIntellectualPropertyInput,
  ) {
    return this.ipService.getTrademarkByVmId(input.key)
  }
}
