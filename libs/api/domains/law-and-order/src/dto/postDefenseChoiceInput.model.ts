import { Field, ID, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType('LawAndOrderDefenseChoiceInput')
export class PostDefenseChoiceInput {
  @Field(() => ID)
  @IsString()
  caseId!: string

  @Field(() => String)
  @IsString()
  choice!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  lawyersNationalId?: string
}
