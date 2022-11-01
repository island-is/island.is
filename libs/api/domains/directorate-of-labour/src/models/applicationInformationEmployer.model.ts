import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ApplicationInformationEmployer {
  @Field(() => String, { nullable: true })
  employerId!: string

  @Field(() => String, { nullable: true })
  email!: string

  @Field(() => String, { nullable: true })
  nationalRegistryId!: string
}
