import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Group } from './group.model'

export enum AppealDecision {
  ACCEPT = 'ACCEPT',
  POSTPONE = 'POSTPONE',
  NO_ANSWER = 'NO_ANSWER',
}

registerEnumType(AppealDecision, {
  name: 'LawAndOrderAppealDecision',
})

@ObjectType('LawAndOrderVerdict')
export class Verdict {
  @Field(() => ID)
  cacheId!: string

  @Field()
  caseId!: string

  @Field()
  title!: string

  @Field()
  subtitle!: string

  @Field(() => AppealDecision)
  appealDecision!: AppealDecision

  @Field({ nullable: true })
  canAppeal?: boolean

  @Field(() => [Group], { nullable: true })
  groups?: Array<Group>
}
