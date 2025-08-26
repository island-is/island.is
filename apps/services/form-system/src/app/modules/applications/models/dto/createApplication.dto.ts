import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty } from 'class-validator'

export class CreateApplicationDto {
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  isTest!: boolean
}
