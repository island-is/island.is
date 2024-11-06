import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'

export class PresignedUrlResponseDto {
  @ApiProperty()
  @Expose()
  @IsString()
  url?: string
}
