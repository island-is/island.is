import { IsArray, IsNumber, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

class DataProviderDto {
  @IsString()
  @ApiProperty()
  actionId!: string

  @ApiPropertyOptional()
  @IsNumber()
  order?: number
}

export class PopulateExternalDataDto {
  @IsArray()
  @Type(() => DataProviderDto)
  @ApiProperty({ type: [DataProviderDto] })
  readonly dataProviders!: DataProviderDto[]
}
