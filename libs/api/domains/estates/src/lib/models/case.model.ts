import { Field, ObjectType } from '@nestjs/graphql'

import { CaseStatus } from './caseStatus.model'
import { Deadline } from './deadline.model'
import { DeceasedPerson } from './deceasedPerson.model'
import { EstateDocument } from './document.model'
import { EstatesRepresentative } from './estateRepresentative.model'
import { EstatesFieldValue } from './fieldValue.model'
import { Inheritor } from './inheritor.model'
import { EstateManager } from './manager.model'
import { NextStep } from './nextStep.model'
import { Progress } from './progress.model'

@ObjectType('EstatesCase')
export class EstateCase {
  @Field({ nullable: true })
  id?: string

  @Field(() => EstatesFieldValue, { nullable: true })
  caseId?: EstatesFieldValue

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
