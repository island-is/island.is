import { Allow } from 'class-validator'
import { Field, InputType, registerEnumType } from '@nestjs/graphql'

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
}
