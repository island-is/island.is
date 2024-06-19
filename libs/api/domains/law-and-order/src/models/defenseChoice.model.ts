import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('LawAndOrderDefenseChoice')
export class DefenseChoice {
  @Field(() => String, { nullable: true })
  caseId?: string

  @Field(() => String, { nullable: true })
  choice?: string

  @Field(() => String, { nullable: true })
  lawyersNationalId?: string
}
