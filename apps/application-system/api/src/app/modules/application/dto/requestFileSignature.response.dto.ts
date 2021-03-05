import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'

export class RequestFileSignatureResponseDto {
  @ApiProperty()
  @Expose()
  @IsString()
  documentToken?: string

  @ApiProperty()
  @Expose()
  @IsString()
  controlCode?: string
}
