import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { HTMLText, PlainText } from '@island.is/regulations'

export class AppendixModel {
  @ApiProperty()
  title!: PlainText

  @ApiProperty()
  text!: HTMLText

  @ApiPropertyOptional()
  diff?: HTMLText
}
