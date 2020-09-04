import { IsArray, IsEnum, IsString } from 'class-validator'
import { DataProviderTypes } from '@island.is/application/template'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

class DataProviderDto {
  @IsString()
  @ApiProperty()
  id: string

  @IsEnum(DataProviderTypes)
  @ApiProperty({ enum: DataProviderTypes })
  type: DataProviderTypes
}

export class PopulateExternalDataDto {
  @IsArray()
  @Type(() => DataProviderDto)
  @ApiProperty({ type: [DataProviderDto] })
  readonly dataProviders: DataProviderDto[]
}
