import { Field, InputType } from '@nestjs/graphql'
import { IsArray, IsBoolean, IsOptional } from 'class-validator'
import { GenericLicenseTypeType } from '../licenceService.type'

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
