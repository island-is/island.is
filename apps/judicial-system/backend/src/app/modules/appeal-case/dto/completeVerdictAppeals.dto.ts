import {
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsUUID,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

// How many verdict appeals one request may complete. Each is read with its
// whole case under a lock held until the request commits.
export const MAX_COMPLETED_VERDICT_APPEALS = 100

export class CompleteVerdictAppealsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @ArrayMaxSize(MAX_COMPLETED_VERDICT_APPEALS)
  @IsUUID(undefined, { each: true })
  @ApiProperty({ type: String, isArray: true })
  readonly appealCaseIds!: string[]
}
