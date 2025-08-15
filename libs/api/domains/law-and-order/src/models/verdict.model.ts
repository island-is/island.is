import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Group } from './group.model'

export enum AppealDecision {
  ACCEPT = 'ACCEPT',
  POSTPONE = 'POSTPONE',
}

registerEnumType(AppealDecision, {
  name: 'LawAndOrderAppealDecision',
})

@ObjectType('LawAndOrderVerdict')
export class Verdict {
  @Field()
  caseId!: string

  @Field()
  title!: string

  @Field()
  subtitle!: string

  @Field(() => AppealDecision)
  appealDecision!: AppealDecision

  @Field(() => [Group], { nullable: true })
  groups?: Array<Group>
}
