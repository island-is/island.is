import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
} from 'class-validator'

export class CreatePdfSignedUrlResponseDto {
  @ApiProperty()
  @IsString()
  url!: string
}
