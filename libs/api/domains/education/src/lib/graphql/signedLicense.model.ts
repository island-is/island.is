import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class SignedLicense {
  @Field(() => ID)
  url!: string
}
