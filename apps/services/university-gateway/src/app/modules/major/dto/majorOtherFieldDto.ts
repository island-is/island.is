import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'
import { FieldType } from '../types'

export class MajorOtherFieldDto {
  @IsString()
  @ApiProperty({
    description: 'Field name (Icelandic)',
    example: 'Ferilskrá',
  })
  nameIs!: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Field name (English)',
    example: 'CV',
  })
  @ApiPropertyOptional()
  nameEn?: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Field description (Icelandic)',
    example: 'Fusce sit amet pellentesque magna.',
  })
  @ApiPropertyOptional()
  descriptionIs?: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Field description (English)',
    example: 'Phasellus nisi turpis, rutrum vitae congue sed.',
  })
  @ApiPropertyOptional()
  descriptionEn?: string

  @IsString()
  @ApiProperty({
    description: 'Is this field required?',
    example: true,
  })
  required!: string

  @IsEnum(FieldType)
  @ApiProperty({
    description:
      'What type of field should be displayed in the application form',
    example: FieldType.UPLOAD,
    enum: FieldType,
  })
  fieldType!: FieldType

  @IsString()
  @IsOptional()
  @ApiProperty({
    description:
      'If field type is UPLOAD, then this field is required and should list up all file types that should be accepted',
    example: '.pdf, .jpg, .jpeg, .png',
  })
  @ApiPropertyOptional()
  uploadAcceptedFileType?: string
}
