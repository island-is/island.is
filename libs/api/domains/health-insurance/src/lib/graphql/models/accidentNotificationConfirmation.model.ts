import { Field, ObjectType } from '@nestjs/graphql'
import { IsEnum } from 'class-validator'
import { HealthInsuranceAccidentNotificationConfirmationTypes } from '../../types'


@ObjectType()
export class AccidentNotificationConfirmation {
  @Field(() => Boolean)
  isReceived?: boolean

  @Field(() => HealthInsuranceAccidentNotificationConfirmationTypes)
  @IsEnum(HealthInsuranceAccidentNotificationConfirmationTypes)
  confirmationType?: HealthInsuranceAccidentNotificationConfirmationTypes
}
