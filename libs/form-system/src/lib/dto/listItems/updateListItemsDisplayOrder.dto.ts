import { ApiProperty } from '@nestjs/swagger'
import { ListItemDisplayOrderDto } from './listItemDisplayOrder.dto'
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateListItemsDisplayOrderDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ListItemDisplayOrderDto)
  @IsArray()
  @ApiProperty({ type: [ListItemDisplayOrderDto] })
  listItemsDisplayOrderDto!: ListItemDisplayOrderDto[]
}
