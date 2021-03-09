import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsBoolean } from 'class-validator'

export class UploadSignedFileResponseDto {
  @ApiProperty()
  @Expose()
  @IsBoolean()
  documentSigned?: boolean
}
