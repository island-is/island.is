import { Field, ObjectType } from '@nestjs/graphql'

import { CaseTableType } from '@island.is/judicial-system/types'

@ObjectType()
export class CaseTableMembershipResponse {
  @Field(() => [CaseTableType], {
    description:
      'Case table types (for the current user role) that this case belongs to',
  })
  readonly caseTableTypes!: CaseTableType[]
}
