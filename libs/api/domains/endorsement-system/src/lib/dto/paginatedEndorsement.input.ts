import { Field, InputType } from '@nestjs/graphql'
import { IsUUID, IsString, IsNumber } from 'class-validator'

@InputType()
export class PaginatedEndorsementInput {
  @Field()
  @IsUUID(4)
  listId!: string

  @Field()
  @IsNumber()
  limit?: number

  @Field()
  @IsString()
  before?: string

  @Field()
  @IsString()
  after?: string


}
