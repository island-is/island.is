import { Field, InputType } from '@nestjs/graphql'
import { IsNumber, IsOptional,IsString, IsUUID } from 'class-validator'

@InputType()
export class PaginatedEndorsementInput {
  @Field()
  @IsUUID(4)
  listId!: string

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  limit?: number

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  before?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  after?: string
}
