import {
  IsString,
  IsObject,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export enum SdfActionType {
  NEXT_PAGE = 'NEXT_PAGE',
  PREV_PAGE = 'PREV_PAGE',
  // Jump directly to a known page by id (overview "Breyta"/edit button). The
  // destination page id is carried in the `event` field.
  GO_TO_PAGE = 'GO_TO_PAGE',
  SUBMIT = 'SUBMIT',
  REFETCH = 'REFETCH',
  VALIDATE = 'VALIDATE',
}

export class ExecuteActionDto {
  @IsEnum(SdfActionType)
  @ApiProperty({ enum: SdfActionType })
  readonly actionType!: SdfActionType

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  readonly answers?: Record<string, unknown>

  @IsString()
  @ApiProperty()
  readonly locale!: string

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description:
      'Deprecated. The backend now tracks page index in the database.',
    deprecated: true,
  })
  readonly lastKnownPageIndex?: number

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({
    description:
      'Field IDs to validate (only used with VALIDATE actionType).',
    type: [String],
  })
  readonly fieldIds?: string[]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Event name for SUBMIT transitions.' })
  readonly event?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({
    description:
      'Template API action names to run on REFETCH (must be allowed for the current role).',
    type: [String],
  })
  readonly refetchTemplateApiActions?: string[]
}
