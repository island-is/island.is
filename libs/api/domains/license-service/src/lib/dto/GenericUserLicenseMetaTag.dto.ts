import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import {
  GenericUserLicenseDataFieldTagColor,
  GenericUserLicenseDataFieldTagType,
} from '../licenceService.type'

registerEnumType(GenericUserLicenseDataFieldTagType, {
  name: 'GenericUserLicenseDataFieldTagType',
  description: 'Exhaustive list of possible tag icons',
})
registerEnumType(GenericUserLicenseDataFieldTagColor, {
  name: 'GenericUserLicenseDataFieldTagColor',
  description: 'Exhaustive list of possible tag icon color',
})

@ObjectType('GenericUserLicenseMetaTag')
export class GenericUserLicenseMetaTag {
  @Field()
  text!: string

  @Field({ nullable: true })
  color?: string

  @Field(() => GenericUserLicenseDataFieldTagType, { nullable: true })
  icon?: GenericUserLicenseDataFieldTagType

  @Field(() => GenericUserLicenseDataFieldTagColor, { nullable: true })
  iconColor?: GenericUserLicenseDataFieldTagColor

  @Field({
    nullable: true,
    description:
      'Defaults to the text property if icon defined but iconText left undefined',
  })
  iconText?: string
}
