import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ApplicationInformationChildren {
  @Field(() => String, { nullable: true })
  expectedDateOfBirth?: string | null

  @Field(() => String, { nullable: true })
  dateOfBirth?: string | null

  @Field(() => String, { nullable: true })
  nationalRegistryId?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null
}
