import { Field, ID, ObjectType } from '@nestjs/graphql'

import type { PoliceCaseInfo as TPoliceCaseInfo } from '@island.is/judicial-system/types'

@ObjectType()
export class PoliceCaseInfo implements TPoliceCaseInfo {
  @Field(() => ID)
  readonly caseNumber!: string
}
