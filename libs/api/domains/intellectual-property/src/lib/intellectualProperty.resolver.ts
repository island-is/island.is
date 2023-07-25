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
import { Image } from './models/getDesignImage.model'
import { GetIntellectualPropertyInput } from './dto/getPatent.input'
import { Trademark } from './models/getTrademark.model'
import { GetIntellectualPropertyDesignImageInput } from './dto/getDesignImage.input'
import { DesignImageCollection } from './models/getDesignImageCollection.model'

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
  @Query(() => DesignImageCollection, {
    name: 'intellectualPropertyDesignImageCollection',
    nullable: true,
  })
  @Audit()
  async getIntellectualPropertyDesignImageCollectionById(
    @Args('input', { type: () => GetIntellectualPropertyInput })
    input: GetIntellectualPropertyInput,
  ) {
    return {
      images: await this.ipService.getDesignImages(input.key),
    }
  }

  @Scopes(ApiScope.internal)
  @Query(() => Image, {
    name: 'intellectualPropertyDesignImage',
    nullable: true,
  })
  @Audit()
  getIntellectualPropertyDesignImageById(
    @Args('input', { type: () => GetIntellectualPropertyDesignImageInput })
    input: GetIntellectualPropertyDesignImageInput,
  ) {
    return this.ipService.getDesignImage(
      input.hId,
      input.designNumber,
      input.imageNumber,
      input.size,
    )
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
