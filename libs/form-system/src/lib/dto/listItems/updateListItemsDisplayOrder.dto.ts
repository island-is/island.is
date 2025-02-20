import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { ListItemDisplayOrderDto } from './listItemDisplayOrder.dto'
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

@InputType('FormSystemUpdateListItemsDisplayOrder')
export class UpdateListItemsDisplayOrderDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ListItemDisplayOrderDto)
  @IsArray()
  @ApiProperty({ type: [ListItemDisplayOrderDto] })
  @Field(() => [ListItemDisplayOrderDto])
  listItemsDisplayOrderDto!: ListItemDisplayOrderDto[]
}

@InputType('FormSystemUpdateListItemsDisplayOrderInput')
export class UpdateListItemsDisplayOrderInput {
  @Field(() => UpdateListItemsDisplayOrderDto)
  updateListItemsDisplayOrderDto!: UpdateListItemsDisplayOrderDto
}
