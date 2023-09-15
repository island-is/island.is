import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class ActiveDTO {
  @IsBoolean()
  @ApiProperty({
    example: true,
  })
  active!: boolean
}
