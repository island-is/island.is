import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/**********
 * The document the district court writes up for a ruling order that was
 * pronounced orally. It fills in the ruling that already exists rather than
 * creating a new case file, so only the parts a document brings with it are
 * given here.
 **********/
export class AttachRulingOrderDocumentDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty({ type: String })
  readonly type!: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty({ type: String })
  readonly key!: string

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number })
  readonly size!: number

  /**********
   * The ruling keeps the name it was given when it was pronounced unless the
   * district court renamed it while uploading the document.
   **********/
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly userGeneratedFilename?: string
}
