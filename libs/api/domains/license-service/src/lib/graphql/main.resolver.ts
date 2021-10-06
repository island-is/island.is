import {
  Args,
  Query,
  Resolver,
  InputType,
  Field,
  Mutation,
} from '@nestjs/graphql'
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
import {
  GenericPkPass,
  GenericPkPassVerification,
  GenericUserLicense,
} from './genericLicense.model'
import {
  GenericLicenseType,
  GenericLicenseTypeType,
} from '../licenceService.type'

@InputType()
export class GetGenericLicensesInput {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  includedTypes?: Array<GenericLicenseTypeType>

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  excludedTypes?: Array<GenericLicenseTypeType>

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
  licenseType!: GenericLicenseType
}

@InputType()
export class GeneratePkPassInput {
  @Field(() => String)
  licenseType!: GenericLicenseType
}

@InputType()
export class VerifyPkPassInput {
  @Field(() => String)
  licenseType!: GenericLicenseType

  @Field(() => String)
  data!: string
}

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(private readonly licenseServiceService: LicenseServiceService) {}

  @Query(() => [GenericUserLicense])
  async genericLicenses(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input', { nullable: true }) input?: GetGenericLicensesInput,
  ) {
    const licenses = await this.licenseServiceService.getAllLicenses(
      user.nationalId,
      locale,
      {
        includedTypes: input?.includedTypes,
        excludedTypes: input?.excludedTypes,
        force: input?.force,
        onlyList: input?.onlyList,
      },
    )
    return licenses
  }

  @Query(() => GenericUserLicense)
  async genericLicense(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: GetGenericLicenseInput,
  ) {
    const license = await this.licenseServiceService.getLicense(
      user.nationalId,
      locale,
      input.licenseType,
    )

    return license
  }

  @Mutation(() => GenericPkPass)
  async generatePkPass(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: GeneratePkPassInput,
  ): Promise<GenericPkPass> {
    const pkpassUrl = await this.licenseServiceService.generatePkPass(
      user.nationalId,
      locale,
      input.licenseType,
    )

    return {
      pkpassUrl,
    }
  }

  @Mutation(() => GenericPkPassVerification)
  async verifyPkPass(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: VerifyPkPassInput,
  ): Promise<GenericPkPassVerification> {
    const verification = await this.licenseServiceService.verifyPkPass(
      user.nationalId,
      locale,
      input.licenseType,
      input.data,
    )

    return verification
  }
}
