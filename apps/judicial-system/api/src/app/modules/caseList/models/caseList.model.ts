import { Field, ObjectType, ID } from '@nestjs/graphql'

import type {
  CaseListEntry as TCaseListEntry,
  CaseType,
} from '@island.is/judicial-system/types'

@ObjectType()
export class CaseListEntry implements TCaseListEntry {
  @Field(() => ID)
  readonly id!: string
}
