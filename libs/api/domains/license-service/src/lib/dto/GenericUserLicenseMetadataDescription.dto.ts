import { Field, ObjectType } from '@nestjs/graphql'
import { GenericUserLicenseMetaLinksType } from '../licenceService.type'

@ObjectType('GenericUserLicenseMetadataDescription')
export class GenericUserLicenseMetadataDescription {
  @Field()
  text!: string

  @Field({ nullable: true, description: 'If defined, changes text to link' })
  linkInText?: string

  @Field(() => GenericUserLicenseMetaLinksType, {
    nullable: true,
    defaultValue: GenericUserLicenseMetaLinksType.External,
  })
  linkIconType?: GenericUserLicenseMetaLinksType
}
