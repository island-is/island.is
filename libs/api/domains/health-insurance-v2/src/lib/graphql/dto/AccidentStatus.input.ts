import { Field, InputType } from '@nestjs/graphql'
import { IsNumber } from 'class-validator'

@InputType()
export class AccidentStatusInput {
  @Field()
  @IsNumber()
  ihiDocumentID!: number
}
