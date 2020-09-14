import { IsObject, IsString, IsOptional, IsNotEmpty } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateApplicationStateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly event: string

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  readonly answers?: object
}
