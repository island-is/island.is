import { Field, ObjectType } from '@nestjs/graphql'

import { PendingSignature as TPendingSignature } from '@island.is/judicial-system/types'

@ObjectType()
export class PendingSignature implements TPendingSignature {
  @Field()
  controlCode: string

  @Field()
  documentToken: string
}
