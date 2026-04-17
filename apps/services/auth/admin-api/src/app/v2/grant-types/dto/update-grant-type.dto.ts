import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateGrantTypeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'updated description',
  })
  readonly description!: string
}
