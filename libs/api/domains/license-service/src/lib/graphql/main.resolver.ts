import { Args, Query, Resolver, InputType, Field } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'

import { IsBoolean, IsArray, IsOptional } from 'class-validator'

import { LicenseServiceService } from '../licenseService.service'
import { GenericUserLicenseFields } from './genericLicense.model'

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

  @Query(() => [GenericUserLicenseFields])
  genericLicenses(
    @CurrentUser() user: User,
    @Args('input', { nullable: true }) input?: GetGenericLicensesInput,
  ) {
    return this.licenseServiceService.getAllLicenses(user.nationalId, {
      includedProviders: input?.includedProviders,
      excludedProviders: input?.excludedProviders,
      force: input?.force,
      onlyList: input?.onlyList,
    })
  }

  @Query(() => GenericUserLicenseFields)
  genericLicense(
    @CurrentUser() user: User,
    @Args('input') input: GetGenericLicenseInput,
  ) {
    return this.licenseServiceService.getLicense(
      user.nationalId,
      input.providerId,
      input.licenseType,
      input.licenseId,
    )
  }
}
