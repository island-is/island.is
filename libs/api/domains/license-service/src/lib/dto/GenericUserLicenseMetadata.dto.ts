import { Field, ObjectType } from '@nestjs/graphql'
import { GenericUserLicenseMetaLinks } from './GenericUserLicenseMetaLinks.dto'
import { GenericUserLicenseMetaTag } from './GenericUserLicenseMetaTag.dto'

@ObjectType()
export class GenericUserLicenseMetadata {
  @Field(() => [GenericUserLicenseMetaLinks], { nullable: true })
  links?: Array<GenericUserLicenseMetaLinks>

  @Field({ nullable: true })
  licenseNumber?: string

  @Field({ nullable: true })
  licenseNumberDisplay?: string

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

  @Field({ nullable: true, description: 'Display description for detail view' })
  description?: string
}
