import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('FinanceAnnualStatusDocumentInput')
export class GetAnnualStatusDocumentInput {
  @Field()
  @IsString()
  year!: string
}
