import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum InsuranceErrorStatus {
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_SERVICE_ERROR = 'INTERNAL_SERVICE_ERROR',
}

registerEnumType(InsuranceErrorStatus, {
  name: 'InsuranceErrorStatus',
})

@ObjectType('RightsPortalInsuranceError')
export class InsuranceError {
  @Field(() => String)
  message!: string

  @Field(() => InsuranceErrorStatus)
  status!: InsuranceErrorStatus
}
