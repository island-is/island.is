import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class EndorsementDto {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  showName!: boolean

  @ApiProperty({ type: String })
  email!: string
}
