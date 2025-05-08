import { Allow, IsNumber, IsOptional, Min, ValidateIf } from 'class-validator'

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
  @IsOptional()
  @Field(() => CaseFileCategory, { nullable: true })
  readonly category?: CaseFileCategory

  @Allow()
  @Field(() => String)
  readonly key!: string

  @Allow()
  @Field(() => Int)
  readonly size!: number

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly policeCaseNumber?: string

  @Allow()
  @IsOptional()
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
  @IsOptional()
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
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly displayDate?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly policeFileId?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly userGeneratedFilename?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly submissionDate?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly fileRepresentative?: string
}
