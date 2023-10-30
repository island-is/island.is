import { Inject, UseGuards } from '@nestjs/common'
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
import { isDefined } from '@island.is/shared/utils'
import { ImageList } from './models/designImageList.model'
import { IntellectualPropertyList } from './models/intellectualPropertyList.model'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard)
@Audit({ namespace: '@island.is/api/intellectual-property' })
export class IntellectualPropertyResolver {
  constructor(
    private readonly ipService: IntellectualPropertyService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Scopes(ApiScope.internal)
  @Query(() => IntellectualPropertyList, {
    name: 'intellectualProperties',
    nullable: true,
  })
  @Audit()
  async getIntellectualProperties(
    @CurrentUser() user: User,
  ): Promise<IntellectualPropertyList | null> {
    const data = await Promise.all([
      this.ipService.getPatents(user),
      this.ipService.getDesigns(user),
      this.ipService.getTrademarks(user),
    ])

    const flattenedData = data.filter(isDefined).flat()

    return {
      count: flattenedData.length,
      items: flattenedData,
    }
  }

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
  async getIntellectualPropertyDesignById(
    @CurrentUser() user: User,
    @Args('input', { type: () => GetIntellectualPropertyInput })
    input: GetIntellectualPropertyInput,
  ) {
    return this.ipService.getDesignById(user, input.key)
  }

  @Scopes(ApiScope.internal)
  @Query(() => ImageList, {
    name: 'intellectualPropertyDesignImageList',
    nullable: true,
  })
  @Audit()
  async getIntellectualPropertyDesignImageList(
    @CurrentUser() user: User,
    @Args('input', { type: () => GetIntellectualPropertyInput })
    input: GetIntellectualPropertyInput,
  ): Promise<ImageList | null> {
    const images = await this.ipService.getDesignImages(user, input.key)
    if (!images) {
      return null
    }

    return {
      images,
      count: images.length,
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
  @Query(() => [Trademark], {
    name: 'intellectualPropertyTrademarks',
    nullable: true,
  })
  @Audit()
  getIntellectualPropertyTrademarks(@CurrentUser() user: User) {
    return this.ipService.getTrademarks(user)
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
