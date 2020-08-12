import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class AuthInput {
  @Field({ defaultValue: 'World' })
  @IsString()
  name: string
}
