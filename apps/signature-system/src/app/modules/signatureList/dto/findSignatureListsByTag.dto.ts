import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class FindSignatureListByTagDto {
  @IsString()
  @ApiProperty()
  tag!: string
}
