import { ApiScope } from '@island.is/auth/scopes'
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
  Scopes,
} from '@island.is/auth-nest-tools'
import { IsBoolean, IsArray, IsOptional } from 'class-validator'
import type { Locale } from '@island.is/shared/types'
import { Audit } from '@island.is/nest/audit'
import {
  GenericPkPass,
  GenericPkPassQrCode,
  GenericPkPassVerification,
  GenericUserLicense,
} from './genericLicense.model'
import {
  GenericLicenseType,
  GenericLicenseTypeType,
} from '../licenceService.type'
import { LicenseServiceServiceV2 } from '../licenseServiceV2.service'

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
  data!: string
}

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal, ApiScope.licenses)
@Resolver()
@Audit({ namespace: '@island.is/api/license-service' })
export class MainResolver {
  constructor(
    private readonly licenseServiceService: LicenseServiceServiceV2,
  ) {}

  @Query(() => [GenericUserLicense])
  @Audit()
  async genericLicenses(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input', { nullable: true }) input?: GetGenericLicensesInput,
  ) {
    const licenses = await this.licenseServiceService.getAllLicenses(
      user,
      locale,
      {
        includedTypes: input?.includedTypes ?? ['DriversLicense'],
        excludedTypes: input?.excludedTypes,
        force: input?.force,
        onlyList: input?.onlyList,
      },
    )
    return licenses
  }

  @Query(() => GenericUserLicense)
  @Audit()
  async genericLicense(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: GetGenericLicenseInput,
  ) {
    const license = await this.licenseServiceService.getLicense(
      user,
      locale,
      input.licenseType,
    )
    return license
  }

  @Mutation(() => GenericPkPass)
  @Audit()
  async generatePkPass(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: GeneratePkPassInput,
  ): Promise<GenericPkPass> {
    const pass = await this.licenseServiceService.generatePkPass(
      user,
      locale,
      input.licenseType,
    )

    if (!pass) {
      throw new Error('mIssing pass')
    }

    return {
      pkpassUrl: pass.deliveryPageUrl,
    }
  }

  @Mutation(() => GenericPkPassQrCode)
  @Audit()
  async generatePkPassQrCode(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: GeneratePkPassInput,
  ): Promise<GenericPkPassQrCode> {
    const pass = await this.licenseServiceService.generatePkPass(
      user,
      locale,
      input.licenseType,
    )

    if (!pass) {
      throw new Error('mIssing pass')
    }

    return {
      pkpassQRCode: pass.distributionQRCode,
    }
  }

  @Scopes(ApiScope.internal, ApiScope.licensesVerify)
  @Mutation(() => GenericPkPassVerification)
  @Audit()
  async verifyPkPass(
    @CurrentUser() user: User,
    @Args('locale', { type: () => String, nullable: true })
    locale: Locale = 'is',
    @Args('input') input: VerifyPkPassInput,
  ): Promise<GenericPkPassVerification> {
    const verification = await this.licenseServiceService.verifyPkPass(
      input.data,
    )
    return verification
  }
}
