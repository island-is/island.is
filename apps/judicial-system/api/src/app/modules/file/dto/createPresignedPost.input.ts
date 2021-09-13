import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import type { CreatePresignedPost } from '@island.is/judicial-system/types'

@InputType()
export class CreatePresignedPostInput implements CreatePresignedPost {
  @Allow()
  @Field()
  readonly caseId!: string

  @Allow()
  @Field()
  readonly fileName!: string
}
