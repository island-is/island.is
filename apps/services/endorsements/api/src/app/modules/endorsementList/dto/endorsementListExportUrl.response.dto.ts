import { ApiProperty } from '@nestjs/swagger'

export class EndorsementListExportUrlResponse {
  @ApiProperty({
    description: 'The presigned URL for the exported file',
    example: 'https://example.com/presigned-url-to-file',
  })
  url!: string
}
