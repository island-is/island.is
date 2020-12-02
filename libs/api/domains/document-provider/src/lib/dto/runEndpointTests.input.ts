import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class RunEndpointTestsInput {
  @Field(() => String)
  @IsString()
  recipient!: string

  @Field(() => String)
  @IsString()
  documentId!: string
}
