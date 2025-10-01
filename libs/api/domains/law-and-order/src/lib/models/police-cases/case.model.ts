import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CaseStatus } from './caseStatus.model'

@ObjectType('LawAndOrderPoliceCase')
export class Case {
  @Field(() => ID)
  cacheId!: string

  @Field()
  number!: string

  @Field({ nullable: true })
  type?: string

  @Field(() => CaseStatus, { nullable: true })
  status?: CaseStatus

  @Field({ nullable: true })
  contact?: string

  @Field({ nullable: true })
  courtAdvocate?: string

  @Field({ nullable: true })
  department?: string

  @Field({ nullable: true, description: 'ISO8601' })
  received?: string

  @Field({ nullable: true })
  receivedLocation?: string

  @Field({ nullable: true, description: 'ISO8601' })
  modified?: string
}
