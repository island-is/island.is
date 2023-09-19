import { Field, InputType } from '@nestjs/graphql'

@InputType('RegisterDentistInput')
export class RegisterDentistInput {
  @Field(() => Number)
  id!: number
}
