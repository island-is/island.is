import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsArray } from 'class-validator'

export class AiTranslateDto {
  @ApiProperty()
  @IsString()
  namespace!: string

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  messageKeys!: string[]

  @ApiProperty()
  @IsString()
  sourceLocale!: string

  @ApiProperty()
  @IsString()
  targetLocale!: string
}
