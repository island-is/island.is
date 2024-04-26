import { Field, InputType } from '@nestjs/graphql'

@InputType('CreateAuthLoginRestrictionInput')
export class CreateLoginRestrictionInput {
  @Field(() => Date)
  until!: Date
}
