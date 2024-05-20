import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('LawAndOrderCourtCaseInput')
export class GetCourtCaseInput {
  @Field()
  @IsString()
  id!: string
}
