import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { GenericUserLicenseMetaLinksType } from '../licenceService.type'

registerEnumType(GenericUserLicenseMetaLinksType, {
  name: 'LicenseServiceV2GenericUserLicenseMetaLinksType',
  description: 'Exhaustive list meta link type',
})

@ObjectType('LicenseServiceV2GenericUserLicenseMetaLinks')
export class GenericUserLicenseMetaLinks {
  @Field({ nullable: true })
  label?: string

  @Field({ nullable: true })
  value?: string

  @Field({ nullable: true })
  name?: string

  @Field(() => GenericUserLicenseMetaLinksType, { nullable: true })
  type?: GenericUserLicenseMetaLinksType
}
