import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { GenericLicenseProviderId } from '../licenceService.type'

registerEnumType(GenericLicenseProviderId, {
  name: 'GenericLicenseProviderId',
  description: 'Exhaustive list of license provider IDs',
})

@ObjectType()
export class GenericLicenseProvider {
  @Field(() => GenericLicenseProviderId, {
    description: 'ID of license provider',
  })
  id!: GenericLicenseProviderId
}
