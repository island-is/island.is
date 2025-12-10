import { Query, Resolver, Args } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import {
  type User,
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { HmsService } from '@island.is/clients/hms'
import { Audit } from '@island.is/nest/audit'
import { Addresses, PropertyCodeInfo } from './models/hmsSearch.model'
import { HmsSearchInput } from './dto/hmsSearch.input'
import {
  HmsPropertyCodeInfoInput,
  HmsPropertyInfoInput,
} from './dto/hmsPropertyInfo.input'
import { PropertyInfos } from './models/hmsPropertyInfo.model'
import { HmsPropertyByPropertyCodeInput } from './dto/hmsPropertyByPropertyCode'
import { Fasteign as FasteignAsset } from '@island.is/clients/assets'
import { GraphQLJSONObject } from 'graphql-type-json'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/hms' })
export class HmsResolver {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @Inject(HmsService)
    private hmsService: HmsService,
  ) {}

  @Query(() => Addresses, {
    name: 'hmsSearch',
    nullable: true,
  })
  @Audit()
  async getHmsSearch(
    @CurrentUser() user: User,
    @Args('input') input: HmsSearchInput,
  ): Promise<Addresses> {
    try {
      const addressesArray = await this.hmsService.hmsSearch(user, { ...input })
      return { addresses: addressesArray }
    } catch (error) {
      this.logger.error('Error fetching HMS address search:', error)
      throw new Error('Failed to get addresses')
    }
  }

  @Query(() => PropertyInfos, {
    name: 'hmsPropertyInfo',
    nullable: true,
  })
  @Audit()
  async getHmsPropertyInfo(
    @CurrentUser() user: User,
    @Args('input') input: HmsPropertyInfoInput,
  ): Promise<PropertyInfos> {
    try {
      const propertyInfos = await this.hmsService.hmsPropertyInfo(user, {
        ...input,
      })
      if (!propertyInfos) {
        throw new Error('Property not found')
      }
      return { propertyInfos }
    } catch (error) {
      this.logger.error('Error fetching HMS properties:', error)
      throw new Error('Failed to fetch properties')
    }
  }

  @Query(() => PropertyCodeInfo, {
    name: 'hmsPropertyCodeInfo',
    nullable: true,
  })
  @Audit()
  async getHmsPropertyCodeInfo(
    @CurrentUser() user: User,
    @Args('input') input: HmsPropertyCodeInfoInput,
  ): Promise<PropertyCodeInfo> {
    let addressInfo
    try {
      addressInfo = await this.hmsService.hmsPropertyCodeInfo(user, {
        ...input,
      })
    } catch (error) {
      this.logger.error('Error fetching HMS properties:', error)
      throw new Error('Failed to fetch properties')
    }
    if (!addressInfo) {
      throw new Error('Property not found')
    }
    return { address: addressInfo }
  }

  /**
   * Returns Array<FasteignAsset> serialized as JSON.
   */
  @Query(() => [GraphQLJSONObject], {
    name: 'hmsPropertyByPropertyCode',
    nullable: true,
  })
  @Audit()
  async getHmsPropertyByPropertyCode(
    @CurrentUser() user: User,
    @Args('input') input: HmsPropertyByPropertyCodeInput,
  ): Promise<Array<FasteignAsset>> {
    try {
      const propertyInfos = await this.hmsService.hmsPropertyByPropertyCode(
        user,
        {
          ...input,
        },
      )
      if (!propertyInfos) {
        throw new Error('Property not found')
      }
      return propertyInfos
    } catch (error) {
      this.logger.error('Error fetching HMS properties:', error)
      throw new Error('Failed to fetch properties')
    }
  }
}
