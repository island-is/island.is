import { IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class DeleteTokenResponseDto {
  @IsBoolean()
  @ApiProperty()
  readonly success!: boolean
}
