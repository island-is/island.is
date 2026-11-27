import {
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsUUID,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { MAX_COMPLETED_VERDICT_APPEALS } from '@island.is/judicial-system/types'

export class CompleteVerdictAppealsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @ArrayMaxSize(MAX_COMPLETED_VERDICT_APPEALS)
  @IsUUID(undefined, { each: true })
  @ApiProperty({ type: String, isArray: true })
  readonly appealCaseIds!: string[]
}
