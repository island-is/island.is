import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { GenericUserLicenseFetchStatus } from '../licenceService.type'

registerEnumType(GenericUserLicenseFetchStatus, {
  name: 'LicenseServiceV2GenericUserLicenseFetchStatus',
  description: 'Possible license fetch statuses',
})

@ObjectType('LicenseServiceV2GenericLicenseFetch')
export class GenericLicenseFetch {
  @Field(() => GenericUserLicenseFetchStatus, {
    description: 'Status of license fetch',
  })
  status!: GenericUserLicenseFetchStatus

  @Field({ description: 'Datetime of last update of fetch status' })
  updated!: string
}
