import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetUserProfileInput {
  @Field()
  @IsString()
  nationalId!: string
}
