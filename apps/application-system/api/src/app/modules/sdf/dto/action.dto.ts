import {
  IsString,
  IsObject,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export enum SdfActionType {
  NEXT_PAGE = 'NEXT_PAGE',
  PREV_PAGE = 'PREV_PAGE',
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
  @IsString()
  @ApiPropertyOptional({
    description:
      'The id of the screen the client is on. Required for every action. If no shown screen has the id, nothing is saved and the response is the screen to resume on, with a notice. VALIDATE answers with no errors instead.',
  })
  readonly screen?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({
    description: 'Field IDs to validate (only used with VALIDATE actionType).',
    type: [String],
  })
  readonly fieldIds?: string[]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'For SUBMIT (required): the state-machine event name to fire.',
  })
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
