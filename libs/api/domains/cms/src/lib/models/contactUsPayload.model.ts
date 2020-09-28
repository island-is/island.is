import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ContactUsPayload {
  @Field(() => Boolean)
  success: boolean
}
