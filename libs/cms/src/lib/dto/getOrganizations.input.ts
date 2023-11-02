import { Field, InputType, Int } from '@nestjs/graphql'
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator'

@InputType()
export class GetOrganizationsInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lang?: string

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  perPage?: number

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  organizationTitles?: string[]

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  referenceIdentifiers?: string[]
}
