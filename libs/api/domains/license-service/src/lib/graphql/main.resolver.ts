import { Args, Query, Resolver, InputType, Field } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { IsBoolean, IsArray, IsOptional } from 'class-validator'
import type { Locale } from '@island.is/shared/types'

import { LicenseServiceService } from '../licenseService.service'
import { GenericUserLicense } from './genericLicense.model'

// TODO move these types
@InputType()
export class GetGenericLicensesInput {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  includedProviders?: Array<string>

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  excludedProviders?: Array<string>

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  force?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  onlyList?: boolean
}

@InputType()
export class GetGenericLicenseInput {
  @Field(() => String)
  providerId!: string

  // TODO map to actual type/enum
  @Field(() => [String])
  licenseType!: string

  @Field(() => String)
  licenseId!: string
}

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(private readonly licenseServiceService: LicenseServiceService) {}

  @Query(() => [GenericUserLicense])
  genericLicenses(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input', { nullable: true }) input?: GetGenericLicensesInput,
  ) {
    return this.licenseServiceService.getAllLicenses(user.nationalId, locale, {
      includedProviders: input?.includedProviders,
      excludedProviders: input?.excludedProviders,
      force: input?.force,
      onlyList: input?.onlyList,
    })
  }

  @Query(() => GenericUserLicense)
  genericLicense(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: GetGenericLicenseInput,
  ) {
    return this.licenseServiceService.getLicense(
      user.nationalId,
      locale,
      input.providerId,
      input.licenseType,
      input.licenseId,
    )
  }
}
