import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateScreenDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  sectionId!: string
}
