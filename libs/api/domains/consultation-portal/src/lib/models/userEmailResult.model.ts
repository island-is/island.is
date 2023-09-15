import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('ConsultationPortalUserEmailResult')
export class UserEmailResult {
  @Field(() => String, { nullable: true })
  email?: string | null

  @Field(() => Boolean, { nullable: true })
  emailVerified?: boolean
}
