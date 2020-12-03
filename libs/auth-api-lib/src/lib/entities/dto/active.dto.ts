import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty } from 'class-validator'

export class ActiveDTO {
  @IsBoolean()
  @ApiProperty({
    example: true,
  })
  active!: boolean
}
