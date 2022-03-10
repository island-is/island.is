import { Field, ObjectType } from '@nestjs/graphql'
@ObjectType()
export class AccidentNotificationConfirmation {
  @Field({ nullable: true })
  InjuredOrRepresentativeParty?: boolean

  @Field({ nullable: true })
  CompanyParty?: boolean

  @Field({ nullable: true })
  Unknown?: boolean
}
