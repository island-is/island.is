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
import { Design } from './models/getDesign.model'
import { Image } from './models/getDesignImage.model'
import { GetIntellectualPropertyInput } from './dto/getPatent.input'
import { Trademark } from './models/getTrademark.model'
import { GetIntellectualPropertyDesignImagesInput } from './dto/getDesignImages.input'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard)
@Audit({ namespace: '@island.is/api/intellectual-property' })
export class IntellectualPropertyResolver {
  constructor(private readonly ipService: IntellectualPropertyService) {}

  @Scopes(ApiScope.internal)
  @Query(() => Patent, {
    name: 'intellectualPropertyPatent',
    nullable: true,
  })
  @Audit()
  getIntellectualPropertyPatentById(
    @CurrentUser() user: User,
    @Args('input', { type: () => GetIntellectualPropertyInput })
    input: GetIntellectualPropertyInput,
  ) {
    return this.ipService.getPatentById(user, input.key)
  }

  @Scopes(ApiScope.internal)
  @Query(() => Design, {
    name: 'intellectualPropertyDesign',
    nullable: true,
  })
  @Audit()
  getIntellectualPropertyDesignById(
    @CurrentUser() user: User,
    @Args('input', { type: () => GetIntellectualPropertyInput })
    input: GetIntellectualPropertyInput,
  ) {
    return this.ipService.getDesignById(user, input.key)
  }

  @Scopes(ApiScope.internal)
  @Query(() => [Image], {
    name: 'intellectualPropertyDesignImageCollection',
    nullable: true,
  })
  @Audit()
  async getIntellectualPropertyDesignImageCollectionById(
    @CurrentUser() user: User,
    @Args('input', { type: () => GetIntellectualPropertyInput })
    input: GetIntellectualPropertyInput,
  ) {
    return {
      images: await this.ipService.getDesignImages(user, input.key),
    }
  }

  @Scopes(ApiScope.internal)
  @Query(() => Image, {
    name: 'intellectualPropertyDesignImage',
    nullable: true,
  })
  @Audit()
  getIntellectualPropertyDesignImageById(
    @CurrentUser() user: User,
    @Args('input', { type: () => GetIntellectualPropertyDesignImagesInput })
    input: GetIntellectualPropertyDesignImagesInput,
  ) {
    return this.ipService.getDesignImage(
      user,
      input.designId,
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
    @CurrentUser() user: User,
    @Args('input', { type: () => GetIntellectualPropertyInput })
    input: GetIntellectualPropertyInput,
  ) {
    return this.ipService.getTrademarkByVmId(user, input.key)
  }
}
