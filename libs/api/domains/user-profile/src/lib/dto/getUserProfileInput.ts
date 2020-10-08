import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class GetUserProfileInput {
  @Field()
  @IsString()
  nationalId!: string
}
