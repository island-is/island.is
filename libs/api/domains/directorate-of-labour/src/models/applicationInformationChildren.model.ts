import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class ApplicationInformationChildren {
  @Field(() => String)
  expectedDateOfBirth!: string

  @Field(() => String)
  dateOfBirth!: string

  @Field(() => String)
  nationalRegistryId!: string

  @Field(() => String)
  name!: string
}
