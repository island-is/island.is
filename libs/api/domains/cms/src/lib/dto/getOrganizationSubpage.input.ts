import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetOrganizationSubpageInput {
  @Field()
  @IsString()
  organizationSlug!: string

  @Field()
  @IsString()
  slug!: string

  @Field(() => String)
  @IsString()
  lang = 'is-IS'
}
