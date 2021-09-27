import { Field, InputType } from '@nestjs/graphql'
import { IsNumber, IsString } from 'class-validator'

@InputType()
export class RskCompanyInfoSearchInput {
  @Field()
  @IsString()
  searchTerm!: string

  @Field()
  @IsNumber()
  first!: number

  @Field()
  @IsString()
  after!: string
}
