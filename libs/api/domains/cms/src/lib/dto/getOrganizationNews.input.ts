import { Field, InputType, Int } from '@nestjs/graphql'
import { IsInt, IsOptional, IsString } from 'class-validator'

@InputType()
export class GetOrganizationNewsInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  organizationSlug?: string

  @Field()
  @IsString()
  lang: string

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  size?: number = 10
}
