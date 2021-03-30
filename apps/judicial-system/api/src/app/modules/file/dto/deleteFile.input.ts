import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { DeleteFile } from '@island.is/judicial-system/types'

@InputType()
export class DeleteFileInput implements DeleteFile {
  @Allow()
  @Field()
  readonly caseId!: string

  @Allow()
  @Field()
  readonly id!: string
}
