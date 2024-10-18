import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class SectionDisplayOrderDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id!: string
}
