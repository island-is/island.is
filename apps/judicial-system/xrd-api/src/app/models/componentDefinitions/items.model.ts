import { ApiProperty } from '@nestjs/swagger'

export class Items {
  @ApiProperty({ type: String })
  label?: string

  @ApiProperty({ type: String, description: 'html string' })
  value?: string

  @ApiProperty({ type: String, enum: ['email', 'tel'] })
  linkType?: 'email' | 'tel'

  @ApiProperty({
    type: String,
    enum: ['text', 'richText', 'accordion', 'radioButton'],
  })
  type?: 'text' | 'richText' | 'accordion' | 'radioButton'
}
