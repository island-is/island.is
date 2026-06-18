import { Type } from 'class-transformer'
import { Allow, IsArray, IsNumber, Min, ValidateNested } from 'class-validator'

import { Field, ID, InputType, Int } from '@nestjs/graphql'

@InputType()
export class IndictmentCountOrderInput {
  @Allow()
  @Field(() => ID)
  readonly id!: string

  @Allow()
  @IsNumber()
  @Min(0)
  @Field(() => Int)
  readonly displayOrder!: number
}

@InputType()
export class ReorderIndictmentCountsInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IndictmentCountOrderInput)
  @Field(() => [IndictmentCountOrderInput])
  readonly counts!: IndictmentCountOrderInput[]
}
