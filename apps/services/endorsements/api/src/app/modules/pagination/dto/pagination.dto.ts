import { ApiProperty } from '@nestjs/swagger'
import { IsNumberString, IsOptional, IsString } from 'class-validator'

export class PaginationDto {
  @ApiProperty({ required: false })
  // @IsNumberString()
  limit?: number

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  before?: string

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  after?: string
}
