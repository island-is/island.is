import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty,IsObject, IsOptional, IsString } from 'class-validator'

export class UpdateApplicationStateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly event!: string

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  readonly answers?: object

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly message?: string
}
