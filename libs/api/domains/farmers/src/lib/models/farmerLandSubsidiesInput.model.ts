import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class FarmerLandSubsidiesInput {
  @Field(() => ID)
  farmId!: string

  @Field({ nullable: true })
  after?: string
}
