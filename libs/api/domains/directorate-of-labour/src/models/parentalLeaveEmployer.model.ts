import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ParentalLeaveEmployer {
  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => String)
  nationalRegistryId!: string
}
