import { Field, ID, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'
import { DefenseChoiceEnum } from '../models/law-and-order/defenseChoiceEnum.model'

@InputType('LawAndOrderDefenseChoiceInput')
export class PostDefenseChoiceInput {
  @Field(() => ID)
  @IsString()
  caseId!: string

  @Field(() => DefenseChoiceEnum)
  choice!: DefenseChoiceEnum

  @Field({ nullable: true })
  @IsOptional()
  lawyersNationalId?: string
}
