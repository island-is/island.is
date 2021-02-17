import { Field, InputType } from '@nestjs/graphql'
import { IsNumber, IsString, Max, Min } from 'class-validator'

@InputType()
export class GetAuctionsInput {
  @Field()
  @IsString()
  organization: string

  @Field()
  @IsNumber()
  @Min(2000)
  @Max(2100)
  year: number

  @Field()
  @IsNumber()
  @Min(0)
  @Max(11)
  month: number

  @Field()
  @IsString()
  lang: string
}
