import { IsArray, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

console.log('-trigger')

class DataProviderDto {
  @IsString()
  @ApiProperty()
  id!: string

  @IsString()
  @ApiProperty()
  type!: string
}

export class PopulateExternalDataDto {
  @IsArray()
  @Type(() => DataProviderDto)
  @ApiProperty({ type: [DataProviderDto] })
  readonly dataProviders!: DataProviderDto[]
}
