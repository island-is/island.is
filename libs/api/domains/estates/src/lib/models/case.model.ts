import { Field, ObjectType } from '@nestjs/graphql'
import { DeceasedPerson } from './deceasedPerson.model'
import { EstatesRepresentative } from './estateRepresentative.model'
import { EstateManager } from './manager.model'
import { CaseStatus } from './caseStatus.model'
import { NextStep } from './nextStep.model'
import { Deadline } from './deadline.model'
import { Progress } from './progress.model'
import { Inheritor } from './inheritor.model'
import { EstateDocument } from './document.model'

@ObjectType('EstatesCase')
export class EstateCase {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  caseId?: string

  @Field(() => DeceasedPerson, { nullable: true })
  deceased?: DeceasedPerson

  @Field(() => EstatesRepresentative, { nullable: true })
  representative?: EstatesRepresentative

  @Field(() => EstateManager, { nullable: true })
  estateManager?: EstateManager

  @Field(() => CaseStatus, { nullable: true })
  status?: CaseStatus

  @Field(() => [NextStep], { nullable: true })
  nextSteps?: NextStep[]

  @Field(() => Deadline, { nullable: true })
  deadline?: Deadline

  @Field(() => Progress, { nullable: true })
  progress?: Progress

  @Field(() => [Inheritor], { nullable: true })
  inheritors?: Inheritor[]

  @Field(() => [EstateDocument], { nullable: true })
  documents?: EstateDocument[]
}
