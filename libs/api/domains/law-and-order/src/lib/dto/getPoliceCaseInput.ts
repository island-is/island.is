import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('LawAndOrderPoliceCaseInput')
export class GetPoliceCaseInput {
  @Field()
  @IsString()
  caseNumber!: string
}
