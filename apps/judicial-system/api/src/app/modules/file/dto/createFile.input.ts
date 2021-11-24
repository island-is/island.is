import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import type { CreateFile } from '@island.is/judicial-system/types'

@InputType()
export class CreateFileInput implements CreateFile {
  @Allow()
  @Field()
  readonly caseId!: string

  @Allow()
  @Field()
  readonly type!: string

  @Allow()
  @Field()
  readonly key!: string

  @Allow()
  @Field()
  readonly size!: number
}
