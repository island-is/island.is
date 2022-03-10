import { Field, InputType } from '@nestjs/graphql'
import { IsNumber } from 'class-validator'

@InputType()
export class HealthInsuranceAccidentStatusInput {
  @Field()
  @IsNumber()
  ihiDocumentID!: number
}
