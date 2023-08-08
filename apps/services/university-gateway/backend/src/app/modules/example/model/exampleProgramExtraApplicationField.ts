import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { FieldType } from '../../program/types'

export class ExampleProgramExtraApplicationField {
  @ApiProperty({
    description: 'Field name (Icelandic)',
    example: 'Ferilskrá',
  })
  nameIs!: string

  @ApiProperty({
    description: 'Field name (English)',
    example: 'CV',
  })
  @ApiPropertyOptional()
  nameEn?: string

  @ApiProperty({
    description: 'Field description (Icelandic)',
    example: 'Fusce sit amet pellentesque magna.',
  })
  @ApiPropertyOptional()
  descriptionIs?: string

  @ApiProperty({
    description: 'Field description (English)',
    example: 'Phasellus nisi turpis, rutrum vitae congue sed.',
  })
  @ApiPropertyOptional()
  descriptionEn?: string

  @ApiProperty({
    description: 'Is this field required?',
    example: true,
  })
  required!: string

  @ApiProperty({
    description:
      'What type of field should be displayed in the application form',
    example: FieldType.UPLOAD,
    enum: FieldType,
  })
  fieldType!: FieldType

  @ApiProperty({
    description:
      'If field type is UPLOAD, then this field is required and should list up all file types that should be accepted',
    example: '.pdf, .jpg, .jpeg, .png',
  })
  @ApiPropertyOptional()
  uploadAcceptedFileType?: string
}
