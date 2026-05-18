import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'

export class AttachmentPresignedUrlDto {
  @ApiProperty()
  @Expose()
  @IsString()
  key!: string

  @ApiProperty()
  @Expose()
  @IsString()
  url!: string
}

export class AttachmentPresignedUrlsResponseDto {
  @ApiProperty({ type: [AttachmentPresignedUrlDto] })
  @Expose()
  attachments!: AttachmentPresignedUrlDto[]
}
