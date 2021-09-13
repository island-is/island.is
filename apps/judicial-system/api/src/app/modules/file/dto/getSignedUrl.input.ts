import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import type { GetSignedUrl } from '@island.is/judicial-system/types'

@InputType()
export class GetSignedUrlInput implements GetSignedUrl {
  @Allow()
  @Field()
  readonly id!: string

  @Allow()
  @Field()
  readonly caseId!: string
}
