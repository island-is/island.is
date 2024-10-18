import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { GenericLicenseDataFieldType } from '../licenceService.type'
import { GenericUserLicenseMetaLinks } from './GenericUserLicenseMetaLinks.dto'
import { GenericUserLicenseMetaTag } from './GenericUserLicenseMetaTag.dto'

registerEnumType(GenericLicenseDataFieldType, {
  name: 'GenericLicenseDataFieldType',
  description: 'Possible types of data fields',
})

@ObjectType()
export class GenericLicenseDataField {
  @Field(() => GenericLicenseDataFieldType, {
    description: 'Type of data field',
  })
  type!: GenericLicenseDataFieldType

  @Field({ nullable: true, description: 'Name of data field' })
  name?: string

  @Field({ nullable: true, description: 'Label of data field' })
  label?: string

  @Field({
    nullable: true,
    description: 'Display value of data field category',
    deprecationReason: 'Only used for cosmetic purposes, can be done better',
  })
  description?: string

  @Field({ nullable: true, description: 'Value of data field' })
  value?: string

  @Field(() => GenericUserLicenseMetaTag, { nullable: true })
  tag?: GenericUserLicenseMetaTag

  @Field(() => GenericUserLicenseMetaLinks, {
    nullable: true,
    description: 'External meta link',
  })
  link?: GenericUserLicenseMetaLinks

  @Field({
    nullable: true,
    description: 'Hide from service portal',
    defaultValue: false,
  })
  hideFromServicePortal?: boolean

  @Field(() => [GenericLicenseDataField], {
    nullable: true,
    description: 'Name of data field',
  })
  fields?: GenericLicenseDataField[]
}
