import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import {
  GenericLicenseType,
  GenericUserLicensePkPassStatus,
  GenericUserLicenseStatus,
} from '../licenceService.type'
import { GenericLicenseProvider } from './GenericLicenseProvider.dto'

registerEnumType(GenericLicenseType, {
  name: 'GenericLicenseType',
  description: 'Exhaustive list of license types',
})

registerEnumType(GenericUserLicenseStatus, {
  name: 'GenericUserLicenseStatus',
  description: 'Possible license statuses for user',
})

registerEnumType(GenericUserLicensePkPassStatus, {
  name: 'GenericUserLicensePkPassStatus',
  description: 'Possible license pkpass statuses',
})

@ObjectType()
export class GenericLicense {
  @Field(() => GenericLicenseType, {
    description: 'Type of license from an exhaustive list',
  })
  type!: GenericLicenseType

  @Field(() => GenericLicenseProvider, {
    description: 'Provider of the license',
  })
  provider!: GenericLicenseProvider

  @Field({ description: 'Display name of license' })
  name?: string

  @Field({ description: 'Does the license support pkpass?' })
  pkpass!: boolean

  @Field({ description: 'Does the license support verification of pkpass?' })
  pkpassVerify!: boolean

  @Field({
    description:
      'How long the data about the license should be treated as fresh',
  })
  timeout!: number

  @Field(() => GenericUserLicenseStatus, { description: 'Status of license' })
  status!: GenericUserLicenseStatus

  @Field(() => GenericUserLicensePkPassStatus, {
    description: 'Status of pkpass availablity of license',
  })
  pkpassStatus!: GenericUserLicensePkPassStatus
}
