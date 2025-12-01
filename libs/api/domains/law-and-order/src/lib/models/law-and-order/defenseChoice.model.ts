import { Field, ObjectType } from '@nestjs/graphql'
import { DefenseChoiceEnum } from './defenseChoiceEnum.model'

@ObjectType('LawAndOrderDefenseChoice')
export class DefenseChoice {
  @Field()
  caseId!: string

  @Field(() => DefenseChoice, { nullable: true })
  choice?: DefenseChoiceEnum

  @Field({ nullable: true })
  lawyersNationalId?: string
}
