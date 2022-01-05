import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'

export class FileContentAsBase64 {
  @ApiProperty()
  @Expose()
  @IsString()
  key!: string
}
