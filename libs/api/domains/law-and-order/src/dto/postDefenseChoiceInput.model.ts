import { Field, ID, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType('LawAndOrderDefenseChoiceInput')
export class PostDefenseChoiceInput {
  @Field(() => ID)
  @IsString()
  caseId!: string

  @Field()
  @IsString()
  choice!: string

  @Field({ nullable: true })
  @IsOptional()
  lawyersNationalId?: string

  @Field()
  locale!: 'is' | 'en'
}
