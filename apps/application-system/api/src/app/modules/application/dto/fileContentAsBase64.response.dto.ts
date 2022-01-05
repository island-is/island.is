import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'

export class FileContentAsBase64ResponseDto {
  @ApiProperty()
  @Expose()
  @IsString()
  content!: string
}
