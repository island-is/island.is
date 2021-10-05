import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class EndorsementDto {
  @ApiProperty()
  @IsBoolean()
  showName!: boolean
}
