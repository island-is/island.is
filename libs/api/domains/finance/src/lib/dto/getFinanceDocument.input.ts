import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetFinanceDocumentInput {
  @Field()
  @IsString()
  documentID!: string
}
