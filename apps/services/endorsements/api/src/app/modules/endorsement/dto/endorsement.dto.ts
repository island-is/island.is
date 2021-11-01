import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class EndorsementDto {
  @ApiProperty({ type: Boolean, example: 'bob' })
  @IsBoolean()
  showName!: boolean
}
