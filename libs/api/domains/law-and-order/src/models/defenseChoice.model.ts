import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('LawAndOrderDefenseChoice')
export class DefenseChoice {
  @Field({ nullable: true })
  caseId?: string

  @Field({ nullable: true })
  choice?: string

  @Field({ nullable: true })
  lawyersNationalId?: string
}
