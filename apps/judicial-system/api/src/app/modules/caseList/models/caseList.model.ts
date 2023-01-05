import { Field, ObjectType, ID } from '@nestjs/graphql'

import type {
  CaseList as TCaseList,
  CaseType,
} from '@island.is/judicial-system/types'

@ObjectType()
export class CaseList implements TCaseList {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String)
  readonly type!: CaseType
}
