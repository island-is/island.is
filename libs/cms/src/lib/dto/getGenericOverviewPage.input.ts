import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetGenericOverviewPageInput {
  @Field()
  @IsString()
  pageIdentifier!: string

  @Field(() => String)
  @IsString()
  lang = 'is-IS'
}
