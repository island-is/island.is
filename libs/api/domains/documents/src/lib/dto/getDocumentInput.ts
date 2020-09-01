import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetDocumentInput {
  @Field()
  @IsString()
  id: string
}
