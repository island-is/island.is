import { Field, ObjectType } from '@nestjs/graphql'

import type { DeleteDefendantResponse as TDeleteDefendantResponse } from '@island.is/judicial-system/types'

@ObjectType()
export class DeleteDefendantResponse implements TDeleteDefendantResponse {
  @Field()
  deleted!: boolean
}
