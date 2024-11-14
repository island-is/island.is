import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'

export class CreateApplicationDto {
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  isTest!: boolean
}
