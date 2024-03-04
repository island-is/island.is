import { Field, InputType } from '@nestjs/graphql'
import { IsArray, IsBoolean, IsOptional } from 'class-validator'
import { LicenseTypeKey } from '../licenceService.type'

@InputType()
export class GetGenericLicensesInput {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  includedTypes?: Array<LicenseTypeKey>

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  excludedTypes?: Array<LicenseTypeKey>

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  force?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  onlyList?: boolean
}
