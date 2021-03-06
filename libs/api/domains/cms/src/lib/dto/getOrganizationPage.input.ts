import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetOrganizationPageInput {
  @Field()
  @IsString()
  slug: string

  @Field()
  @IsString()
  lang: string
}
