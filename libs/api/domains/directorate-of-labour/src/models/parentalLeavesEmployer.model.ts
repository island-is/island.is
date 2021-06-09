import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ParentalLeavesEmployer {
  @Field(() => String, { nullable: true })
  email?: string | null

  @Field(() => String)
  nationalRegistryId!: string
}
