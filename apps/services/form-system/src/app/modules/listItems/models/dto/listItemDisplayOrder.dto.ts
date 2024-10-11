import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ListItemDisplayOrderDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id!: string
}
