import { Field, ObjectType } from '@nestjs/graphql'
import {
  PoliceCaseStatusValue,
  PoliceCaseStatusValueGroup,
} from '../../types/enums'

@ObjectType('LawAndOrderPoliceCaseStatus')
export class CaseStatus {
  @Field(() => PoliceCaseStatusValue)
  value!: PoliceCaseStatusValue

  @Field(() => PoliceCaseStatusValueGroup)
  statusGroup!: PoliceCaseStatusValueGroup

  @Field({ nullable: true })
  timelineStep?: number

  @Field({ nullable: true })
  headerDisplayString?: string

  @Field({ nullable: true })
  descriptionDisplayString?: string

  @Field({ nullable: true })
  policeStatusString?: string
}
