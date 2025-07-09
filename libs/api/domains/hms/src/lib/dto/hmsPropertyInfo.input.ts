import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class HmsPropertyInfoInput {
  @Field()
  stadfangNr!: number
  @Field({ nullable: true })
  fasteignNr?: number
}
@InputType()
export class HmsPropertyCodeInfoInput {
  @Field()
  fasteignNr!: number
}
