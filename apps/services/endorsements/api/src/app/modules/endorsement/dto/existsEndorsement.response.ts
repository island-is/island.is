import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class ExistsEndorsementResponse {
  @ApiProperty()
  @IsBoolean()
  exists!: boolean
}
