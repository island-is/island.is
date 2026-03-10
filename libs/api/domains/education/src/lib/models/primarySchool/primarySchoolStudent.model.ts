import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PrimarySchoolStudent {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field()
  nationalId!: string

  @Field({ nullable: true })
  relationType?: string
}
