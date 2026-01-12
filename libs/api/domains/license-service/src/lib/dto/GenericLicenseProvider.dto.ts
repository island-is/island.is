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

  @Field({
    nullable: true,
    description: 'Contentful entry id',
  })
  entryId?: string

  @Field({
    nullable: true,
    description: 'Contentful reference id',
  })
  referenceId?: string

  @Field({ nullable: true })
  providerName?: string

  @Field({ nullable: true })
  providerLogo?: string
}
