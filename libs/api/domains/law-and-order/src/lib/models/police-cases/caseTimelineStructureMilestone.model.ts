import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { PoliceCaseStatusValueGroup } from '../../types/enums'

@ObjectType('LawAndOrderPoliceCaseTimelineStructureMilestone')
export class CaseTimelineStructureMilestone {
  @Field(() => ID)
  cacheId!: string

  @Field(() => Int)
  step!: number

  @Field(() => PoliceCaseStatusValueGroup)
  statusGroup!: PoliceCaseStatusValueGroup

  @Field()
  label!: string
}
