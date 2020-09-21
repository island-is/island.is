import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class ContactUsPayload {
  @Field(() => Boolean)
  success: boolean
}
