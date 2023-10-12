import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType('NationalRegistryPersonBase')
export class PersonBase {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String, { nullable: true })
  fullName!: string | null

  @Field(() => String, { nullable: true })
  nationalIdType?: string | null
}
