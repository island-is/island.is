import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsBoolean, IsString } from 'class-validator'

export class UpdateUserDeviceTokenDto {
  @ApiProperty({
    required: true,
    example: 'b3f99e48-57e6-4d30-a933-1304dad40c62',
  })
  @IsString()
  id!: string

  @ApiProperty({ required: true, example: false })
  @IsBoolean()
  @Type(() => Boolean)
  isEnabled!: boolean
}
