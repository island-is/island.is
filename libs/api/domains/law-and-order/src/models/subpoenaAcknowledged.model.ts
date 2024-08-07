import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('LawAndOrderSubpoenaAcknowledged')
export class SubpoenaAcknowledged {
  @Field(() => ID, { nullable: true })
  caseId?: string

  @Field({ nullable: true })
  acknowledged?: boolean | undefined
}
