import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class GetOrganizationTagsInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lang?: string
}
