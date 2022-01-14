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

  @Field({
    description: 'Cursor for pagination as base64 encoded number',
    nullable: true,
  })
  after?: string
}
