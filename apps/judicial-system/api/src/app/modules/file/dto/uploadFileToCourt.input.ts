import { Field, InputType } from '@nestjs/graphql'
import { Allow } from 'class-validator'

import type { UploadFileToCourt } from '@island.is/judicial-system/types'

@InputType()
export class UploadFileToCourtInput implements UploadFileToCourt {
  @Allow()
  @Field()
  readonly id!: string

  @Allow()
  @Field()
  readonly caseId!: string
}
