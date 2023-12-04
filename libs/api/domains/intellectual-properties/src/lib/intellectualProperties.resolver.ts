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
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { isDefined } from '@island.is/shared/utils'
import { Patent } from './models/patent.model'
import { Image } from './models/image.model'
import { ImageList } from './models/imageList.model'
import { Design } from './models/design.model'
import { Trademark } from './models/trademark.model'
import { IntellectualPropertiesDesignImagesInput } from './dto/designImages.input'
import { IntellectualPropertiesInput } from './dto/ip.input'
import { IntellectualPropertiesService } from './intellectualProperties.service'
import { IntellectualPropertiesResponse } from './models/intellectualProperty.model'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard)
@Audit({ namespace: '@island.is/api/intellectual-properties' })
export class IntellectualPropertiesResolver {
  constructor(
    private readonly ipService: IntellectualPropertiesService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Scopes(ApiScope.internal)
  @Query(() => IntellectualPropertiesResponse, {
    name: 'intellectualProperties',
    nullable: true,
  })
  @Audit()
  async getIntellectualProperties(
    @CurrentUser() user: User,
  ): Promise<IntellectualPropertiesResponse | null> {
    const data = await Promise.all([
      this.ipService.getPatents(user),
      this.ipService.getDesigns(user),
      this.ipService.getTrademarks(user),
    ])

    const flattenedData = data.filter(isDefined).flat()

    return {
      totalCount: flattenedData.length,
      items: flattenedData,
    }
  }

  @Scopes(ApiScope.internal)
  @Query(() => Patent, {
    name: 'intellectualPropertiesPatent',
    nullable: true,
  })
  @Audit()
  getIntellectualPropertiesPatentById(
    @CurrentUser() user: User,
    @Args('input', { type: () => IntellectualPropertiesInput })
    input: IntellectualPropertiesInput,
  ) {
    return this.ipService.getPatentById(user, input.key)
  }

  @Scopes(ApiScope.internal)
  @Query(() => Design, {
    name: 'intellectualPropertiesDesign',
    nullable: true,
  })
  @Audit()
  async getIntellectualPropertiesDesignById(
    @CurrentUser() user: User,
    @Args('input', { type: () => IntellectualPropertiesInput })
    input: IntellectualPropertiesInput,
  ) {
    //return this.ipService.getDesignById(user, input.key)
    return this.ipService.getDesignById(user, 'H0002611')
  }

  @Scopes(ApiScope.internal)
  @Query(() => ImageList, {
    name: 'intellectualPropertiesDesignImageList',
    nullable: true,
  })
  @Audit()
  async getIntellectualPropertiesDesignImageList(
    @CurrentUser() user: User,
    @Args('input', { type: () => IntellectualPropertiesInput })
    input: IntellectualPropertiesInput,
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
    name: 'intellectualPropertiesDesignImage',
    nullable: true,
  })
  @Audit()
  getIntellectualPropertiesDesignImageById(
    @CurrentUser() user: User,
    @Args('input', { type: () => IntellectualPropertiesDesignImagesInput })
    input: IntellectualPropertiesDesignImagesInput,
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
    name: 'intellectualPropertiesTrademarks',
    nullable: true,
  })
  @Audit()
  getIntellectualPropertiesTrademarks(@CurrentUser() user: User) {
    return this.ipService.getTrademarks(user)
  }

  @Scopes(ApiScope.internal)
  @Query(() => Trademark, {
    name: 'intellectualPropertiesTrademark',
    nullable: true,
  })
  @Audit()
  getIntellectualPropertiesTrademarkById(
    @CurrentUser() user: User,
    @Args('input', { type: () => IntellectualPropertiesInput })
    input: IntellectualPropertiesInput,
  ) {
    return this.ipService.getTrademarkByVmId(user, input.key)
  }
}
