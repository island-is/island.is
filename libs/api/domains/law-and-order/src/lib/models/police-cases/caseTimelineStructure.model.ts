import { Field, ObjectType } from '@nestjs/graphql'
import { CaseTimelineStructureMilestone } from './caseTimelineStructureMilestone.model'

@ObjectType('LawAndOrderPoliceCaseTimelineStructure')
export class CaseTimelineStructure {
  @Field(() => [CaseTimelineStructureMilestone])
  milestones!: CaseTimelineStructureMilestone[]
}
