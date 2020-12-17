import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class RegisterEndpointInput {
  @Field(() => String)
  @IsString()
  nationalId!: string

  @Field(() => String)
  @IsString()
  endpoint!: string

  @Field(() => String)
  @IsString()
  providerId!: string
}
