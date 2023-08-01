import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryBasePerson {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String, { nullable: true })
  fullName!: string | null
}
