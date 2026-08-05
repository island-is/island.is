import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetAnnualReportsInput {
  @Field()
  @IsString()
  organizationSlug!: string

  @Field(() => String)
  @IsString()
  lang = 'is-IS'
}
