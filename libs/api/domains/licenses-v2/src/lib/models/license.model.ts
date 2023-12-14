import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { LicenseType, Provider, Status } from '../licenses.type'
import { Payload } from './payload.model'

registerEnumType(LicenseType, {
  name: 'LicenseType',
  description: 'Exhaustive list of license types',
})

registerEnumType(Provider, {
  name: 'LicensesProvider',
  description: 'The provider of the license',
})

registerEnumType(Status, {
  name: 'LicensesStatus',
  description: 'Does the user have this license?',
})

@ObjectType()
export class License {
  @Field(() => LicenseType, {
    description: 'Type of license from an exhaustive list',
  })
  type!: LicenseType

  @Field(() => Provider)
  provider!: Provider

  @Field(() => Status, { description: 'Status of license' })
  status!: Status

  @Field(() => Status, { description: 'Status of pkpass' })
  pkpassStatus!: Status
}
