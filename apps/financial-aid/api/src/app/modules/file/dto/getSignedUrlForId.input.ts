import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { GetSignedUrlForId } from '@island.is/financial-aid/shared/lib'

@InputType()
export class GetSignedUrlForIdInput implements GetSignedUrlForId {
  @Allow()
  @Field()
  readonly id!: string
}
