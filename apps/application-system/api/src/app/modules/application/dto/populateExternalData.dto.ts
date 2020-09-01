import { IsArray, IsEnum, IsString } from 'class-validator'
import { DataProviderTypes } from '@island.is/application/schema'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

class DataProviderDTO {
  @IsString()
  @ApiProperty()
  id: string

  @IsEnum(DataProviderTypes)
  @ApiProperty({ enum: DataProviderTypes })
  type: DataProviderTypes
}

export class PopulateExternalDataDto {
  @IsArray()
  @Type(() => DataProviderDTO)
  @ApiProperty({ type: [DataProviderDTO] })
  readonly dataProviders: DataProviderDTO[]
}
