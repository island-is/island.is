import { Field, InputType } from '@nestjs/graphql'
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

@InputType()
export class GetAuctionsInput {
  @Field()
  @IsString()
  organization: string

  @Field()
  @IsString()
  lang: string

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(2000)
  @Max(2100)
  year?: number

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(11)
  month?: number
}
