import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import type { DeleteFile } from '@island.is/judicial-system/types'

@InputType()
export class DeleteFileInput implements DeleteFile {
  @Allow()
  @Field()
  readonly id!: string

  @Allow()
  @Field()
  readonly caseId!: string
}
