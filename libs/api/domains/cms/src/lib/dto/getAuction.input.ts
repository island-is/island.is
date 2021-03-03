import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetAuctionInput {
  @Field()
  @IsString()
  id!: string

  @Field()
  @IsString()
  lang = 'is-IS'
}
