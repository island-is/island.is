import { ApiProperty } from '@nestjs/swagger'

export class Items {
  @ApiProperty({ type: String })
  label!: string

  @ApiProperty({ type: String })
  value?: string

  @ApiProperty({ type: String, enum: ['email', 'tel'] })
  linkType?: 'email' | 'tel'
}
