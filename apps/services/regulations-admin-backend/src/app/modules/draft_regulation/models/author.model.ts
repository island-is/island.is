import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Appendix, HTMLText, ISODate, PlainText } from '@island.is/regulations'

export class AuthorModel {
  @ApiProperty()
  readonly authorId!: string

  @ApiPropertyOptional()
  readonly name?: string
}
