import { PaginationDto } from '@island.is/nest/pagination'
import { Field } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

export abstract class SearchListInput extends PaginationDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  search?: string
}
