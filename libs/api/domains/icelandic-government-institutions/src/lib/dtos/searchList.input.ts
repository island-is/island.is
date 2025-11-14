import { PaginationInput } from '@island.is/nest/pagination'
import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export abstract class SearchListInput extends PaginationInput() {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  search?: string
}
