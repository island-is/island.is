import {
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsUUID,
} from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class CompleteVerdictAppealsInput {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @ArrayMaxSize(100)
  @IsUUID(undefined, { each: true })
  @Field(() => [ID])
  readonly appealCaseIds!: string[]
}
