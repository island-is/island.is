import { IsArray, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ApplicationState } from '@island.is/financial-aid/shared/lib'

export class FilterApplicationsDto {
  @IsArray()
  @ApiProperty()
  readonly states: ApplicationState[]

  @IsArray()
  @ApiProperty()
  readonly months: number[]

  @IsNumber()
  @ApiProperty()
  readonly page: number
}
