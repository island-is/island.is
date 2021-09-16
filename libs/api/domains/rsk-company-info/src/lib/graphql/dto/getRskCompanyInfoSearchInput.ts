import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetRskCompanyInfoSearchInput {
  @Field()
  @IsString()
  searchTerm!: string
}
