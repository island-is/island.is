import { Field, ObjectType } from '@nestjs/graphql'

export enum ConfirmationTypes {
  INJUREDORREPRESENTATIVEPARTY = 'InjuredOrRepresentativeParty',
  COMPANYPARTY = 'CompanyParty',
}

@ObjectType()
export class AccidentNotificationConfirmation {
  @Field({ nullable: true })
  InjuredOrRepresentativeParty?: boolean
  @Field({ nullable: true })
  CompanyParty?: boolean
  @Field({ nullable: true })
  Unknown?: boolean
}
