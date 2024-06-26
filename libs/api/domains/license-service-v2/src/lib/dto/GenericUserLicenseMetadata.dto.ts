import { Field, ObjectType } from '@nestjs/graphql'
import { GenericUserLicenseMetaLinks } from './GenericUserLicenseMetaLinks.dto'
import { GenericUserLicenseMetaTag } from './GenericUserLicenseMetaTag.dto'
import { GenericUserLicenseAlert } from './GenericUserLicenseAlert.dto'
import { GenericUserLicenseMetadataDescription } from './GenericUserLicenseMetadataDescription.dto'

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

  @Field(() => GenericUserLicenseMetaTag, { nullable: true })
  displayTag?: GenericUserLicenseMetaTag

  @Field({
    nullable: true,
    description: 'Display title for detail view',
  })
  title?: string

  @Field({
    nullable: true,
    description: 'Display subtitle for detail view',
  })
  subtitle?: string

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
