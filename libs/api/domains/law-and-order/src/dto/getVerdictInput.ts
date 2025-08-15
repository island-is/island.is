import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('LawAndOrderVerdictInput')
export class GetVerdictsInput {
  @Field()
  @IsString()
  caseId!: string
}
