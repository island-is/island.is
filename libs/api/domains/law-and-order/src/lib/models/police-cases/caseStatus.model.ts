import { Field, ObjectType } from '@nestjs/graphql'
import { PoliceCaseStatusValue } from '../../types/enums'

@ObjectType('LawAndOrderPoliceCaseStatus')
export class CaseStatus {
  @Field(() => PoliceCaseStatusValue)
  value!: PoliceCaseStatusValue

  @Field({ nullable: true })
  headerDisplayString?: string

  @Field({ nullable: true })
  descriptionDisplayString?: string
}
