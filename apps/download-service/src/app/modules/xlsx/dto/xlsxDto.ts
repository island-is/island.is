import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class XlsxDto {
  @ApiProperty()
  @IsOptional()
  headers!: Array<string>

  @ApiProperty()
  @IsOptional()
  data!: Array<Array<string | number>>
}
