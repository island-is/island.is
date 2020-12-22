import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class CreateProviderInput {
  @Field(() => String)
  @IsString()
  nationalId!: string

  @Field(() => String)
  @IsString()
  clientName!: string
}
