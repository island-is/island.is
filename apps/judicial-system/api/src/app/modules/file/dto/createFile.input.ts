import { Allow, IsNumber, Min, ValidateIf } from 'class-validator'

import { Field, ID, InputType, Int } from '@nestjs/graphql'

import { CaseFileCategory } from '@island.is/judicial-system/types'

@InputType()
export class CreateFileInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => String)
  readonly type!: string

  @Allow()
  @Field(() => CaseFileCategory, { nullable: true })
  readonly category?: CaseFileCategory

  @Allow()
  @Field(() => String)
  readonly key!: string

  @Allow()
  @Field(() => Int)
  readonly size!: number

  @Allow()
  @Field(() => String, { nullable: true })
  readonly policeCaseNumber?: string

  @Allow()
  @Field(() => Int, {
    nullable: true,
    description:
      'Number of chapter where file is in. 0 or greater. If provided, then order must also be provided.',
  })
  @ValidateIf((file) => typeof file.orderWithinChapter === 'number')
  @IsNumber()
  @Min(0)
  readonly chapter?: number

  @Allow()
  @Field(() => Int, {
    nullable: true,
    description:
      'Number indicating the order within chapter. 0 or greater. If provided, then chapter must also be provided.',
  })
  @ValidateIf((file) => typeof file.chapter === 'number')
  @IsNumber()
  @Min(0)
  readonly orderWithinChapter?: number

  @Allow()
  @Field(() => String, { nullable: true })
  readonly displayDate?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly policeFileId?: string
}
