import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetAnnualStatusDocumentInput {
  @Field()
  @IsString()
  year!: string
}
