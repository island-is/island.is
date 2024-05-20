import { Field, ID, InputType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

@InputType('LawAndOrderDefenseChoiceInput')
export class PostDefenseChoiceInput {
  @Field(() => ID)
  caseId!: string

  @Field(() => String)
  choice!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  lawyersNationalId?: string
}
