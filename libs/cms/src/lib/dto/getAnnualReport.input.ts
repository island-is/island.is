import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetAnnualReportInput {
  @Field()
  @IsString()
  organizationSlug!: string

  @Field()
  @IsString()
  annualReportSlug!: string

  @Field(() => String)
  @IsString()
  lang = 'is-IS'
}
