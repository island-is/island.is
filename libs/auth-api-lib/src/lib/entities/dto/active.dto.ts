import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty } from 'class-validator'

export class ActiveDTO {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
  })
  active: boolean
}
