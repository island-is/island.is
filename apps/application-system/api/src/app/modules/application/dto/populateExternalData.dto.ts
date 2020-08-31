import { IsArray, IsString } from 'class-validator'
import { DataProviderTypes } from '@island.is/application/data-provider'
import { ApiProperty } from '@nestjs/swagger'

export class PopulateExternalDataDto {
  @IsString()
  @ApiProperty()
  readonly id: string

  @IsArray()
  @ApiProperty()
  readonly dataProviders: { id: string; type: DataProviderTypes }[]
}
