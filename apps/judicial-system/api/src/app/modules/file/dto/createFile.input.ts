import { Allow, IsNumber, Min, ValidateIf } from 'class-validator'

import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql'

import type { CreateFile } from '@island.is/judicial-system/types'
import { CaseFileCategory } from '@island.is/judicial-system/types'

registerEnumType(CaseFileCategory, { name: 'CaseFileCategory' })

@InputType()
export class CreateFileInput implements CreateFile {
  @Allow()
  @Field()
  readonly caseId!: string

  @Allow()
  @Field()
  readonly type!: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly category?: CaseFileCategory

  @Allow()
  @Field()
  readonly key!: string

  @Allow()
  @Field()
  readonly size!: number

  @Allow()
  @Field({ nullable: true })
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
  @Field({ nullable: true })
  readonly displayDate?: string

  @Allow()
  @Field({ nullable: true })
  readonly policeFileId?: string
}
