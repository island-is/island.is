import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { GenericUserLicenseMetaLinks } from './GenericUserLicenseMetaLinks.dto'
import { GenericUserLicenseMetaTag } from './GenericUserLicenseMetaTag.dto'
import { GenericUserLicenseMetadataDescription } from './GenericUserLicenseMetadataDescription.dto'
import { GenericUserLicenseAlert } from './GenericUserLicenseAlert.dto'
import { ExpiryStatus } from '../licenceService.type'

registerEnumType(ExpiryStatus, {
  name: 'GenericUserLicenseExpiryStatus',
})

@ObjectType()
export class GenericUserLicenseMetadata {
  @Field(() => [GenericUserLicenseMetaLinks], { nullable: true })
  links?: Array<GenericUserLicenseMetaLinks>

  @Field({ nullable: true })
  licenseNumber?: string

  @Field({
    nullable: true,
    description: 'Unique license identifier',
  })
  licenseId?: string

  @Field({ nullable: true })
  expired?: boolean

  @Field({ nullable: true })
  expireDate?: string

  @Field(() => ExpiryStatus, { nullable: true })
  expiryStatus?: ExpiryStatus

  @Field(() => GenericUserLicenseMetaTag, { nullable: true })
  displayTag?: GenericUserLicenseMetaTag

  @Field({
    nullable: true,
    description: 'Display name of license for the overview',
  })
  name?: string

  @Field({ nullable: true })
  title?: string

  @Field({
    nullable: true,
    description: 'Display subtitle for detail view',
  })
  subtitle?: string

  @Field({
    nullable: true,
    description:
      'Photo of the license holder as a base64 encoded data URI containing a PNG or a JPEG photo (eg `data:image/png;base64,{data}`).',
  })
  photo?: string

  @Field(() => [GenericUserLicenseMetadataDescription], {
    nullable: true,
    description: 'Display description for detail view',
  })
  description?: Array<GenericUserLicenseMetadataDescription>

  @Field(() => GenericUserLicenseMetaLinks, {
    nullable: true,
    description: 'CTA link, only use if necessary',
  })
  ctaLink?: GenericUserLicenseMetaLinks

  @Field(() => GenericUserLicenseAlert, {
    nullable: true,
    description: 'Display an alert on the detail view',
  })
  alert?: GenericUserLicenseAlert
}
