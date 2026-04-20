import { Type } from 'class-transformer'
import { Allow, IsArray, IsNumber, Min, ValidateNested } from 'class-validator'

import { Field, ID, InputType, Int } from '@nestjs/graphql'

@InputType()
export class UpdatePoliceDigitalCaseFile {
  @Allow()
  @Field(() => ID)
  readonly id!: string

  @Allow()
  @IsNumber()
  @Min(0)
  @Field(() => Int)
  readonly orderWithinChapter!: number
}

@InputType()
export class UpdatePoliceDigitalCaseFilesInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePoliceDigitalCaseFile)
  @Field(() => [UpdatePoliceDigitalCaseFile])
  readonly files!: UpdatePoliceDigitalCaseFile[]
}
