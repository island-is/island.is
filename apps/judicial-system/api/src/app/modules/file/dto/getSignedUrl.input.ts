import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { GetSignedUrl } from '@island.is/judicial-system/types'

@InputType()
export class GetSignedUrlInput implements GetSignedUrl {
  @Allow()
  @Field()
  readonly caseId!: string

  @Allow()
  @Field()
  readonly id!: string
}
