import { IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ResourceDto {
  @IsString()
  @Length(10)
  @ApiProperty()
  readonly nationalId: string
}
