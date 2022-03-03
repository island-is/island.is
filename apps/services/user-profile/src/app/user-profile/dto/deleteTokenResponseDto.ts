import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class DeleteTokenResponseDto {
  @IsBoolean()
  @ApiProperty()
  readonly success!: boolean
}
