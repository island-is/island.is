import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateImageDto {
  @IsString()
  @ApiProperty()
  readonly url!: string

  @IsString()
  @ApiProperty()
  readonly key!: string
}
