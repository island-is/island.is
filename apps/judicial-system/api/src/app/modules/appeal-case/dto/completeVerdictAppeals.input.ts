import {
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsUUID,
} from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

import { MAX_COMPLETED_VERDICT_APPEALS } from '@island.is/judicial-system/types'

@InputType()
export class CompleteVerdictAppealsInput {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @ArrayMaxSize(MAX_COMPLETED_VERDICT_APPEALS)
  @IsUUID(undefined, { each: true })
  @Field(() => [ID])
  readonly appealCaseIds!: string[]
}
