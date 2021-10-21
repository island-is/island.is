import { Field, ObjectType } from '@nestjs/graphql'
import { IsEnum } from 'class-validator'

export enum ConfirmationTypes {
  INJUREDORREPRESENTATIVEPARTY = 'InjuredOrRepresentativeParty',
  COMPANYPARTY = 'CompanyParty',
}

@ObjectType()
export class AccidentNotificationConfirmation {
  @Field(() => Boolean)
  isReceived?: boolean

  // 1 = Injured or representative party, 2 = Company party
  @Field(() => String)
  @IsEnum(ConfirmationTypes)
  confirmationType?: string
}
