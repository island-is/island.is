import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class TeachingLicense {
  @Field(() => ID)
  id!: string
}
