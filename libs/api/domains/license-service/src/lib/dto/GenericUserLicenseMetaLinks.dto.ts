import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { GenericUserLicenseMetaLinksType } from '../licenceService.type'

registerEnumType(GenericUserLicenseMetaLinksType, {
  name: 'GenericUserLicenseMetaLinksType',
  description: 'Exhaustive list meta link type',
})

@ObjectType()
export class GenericUserLicenseMetaLinks {
  @Field(() => String, { nullable: true })
  label?: string

  @Field(() => String, { nullable: true })
  value?: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => GenericUserLicenseMetaLinksType, { nullable: true })
  type?: GenericUserLicenseMetaLinksType
}
