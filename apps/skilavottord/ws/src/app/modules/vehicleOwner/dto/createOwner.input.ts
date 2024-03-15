import { Field, InputType } from '@nestjs/graphql'

@InputType('CreateOwnerInput')
export class CreateOwnerInput {
  @Field()
  name!: string
}
