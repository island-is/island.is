import { Field, ObjectType } from '@nestjs/graphql'
import { GenericUserLicenseMetaLinks } from './GenericUserLicenseMetaLinks.dto'

@ObjectType()
export class GenericUserLicenseMetadata {
  @Field(() => [GenericUserLicenseMetaLinks], { nullable: true })
  links?: Array<GenericUserLicenseMetaLinks>

  @Field(() => String)
  licenseNumber?: string

  @Field(() => String, {
    nullable: true,
    description: 'Unique license identifier',
  })
  licenseId?: string

  @Field(() => Boolean, { nullable: true })
  expired?: boolean | null

  @Field(() => String, { nullable: true })
  expireDate?: string | null

  @Field(() => String)
  title?: string

  @Field(() => String)
  logo?: string
}
