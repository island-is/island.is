import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class HmsPropertyByPropertyCodeInput {
  @Field(() => [String], { nullable: true })
  fasteignNrs?: string[]
}
