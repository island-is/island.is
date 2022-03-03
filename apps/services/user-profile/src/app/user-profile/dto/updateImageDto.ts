import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UpdateImageDto {
  @IsString()
  @ApiProperty()
  readonly url!: string

  @IsString()
  @ApiProperty()
  readonly key!: string
}
