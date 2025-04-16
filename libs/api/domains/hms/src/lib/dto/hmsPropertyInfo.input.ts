import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class HmsPropertyInfoInput {
  @Field()
  stadfangNr!: number
}
