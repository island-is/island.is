import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { OccupationalLicenseType } from './occupationalLicense.model'

export enum OccupationalLicensesErrorStatus {
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

registerEnumType(OccupationalLicensesErrorStatus, {
  name: 'OccupationalLicensesErrorStatus',
})

@ObjectType('OccupationalLicensesError')
export class OccupationalLicensesError {
  @Field(() => String)
  message!: string

  @Field(() => OccupationalLicenseType)
  institution!: OccupationalLicenseType

  @Field(() => OccupationalLicensesErrorStatus)
  status!: OccupationalLicensesErrorStatus
}
