import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { MetaLinkType } from '../licenses.type'

@ObjectType('LicensesMetaLink')
export class MetaLink {
  @Field(() => String, { nullable: true })
  label?: string

  @Field(() => String, { nullable: true })
  value?: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => MetaLinkType, { nullable: true })
  type?: MetaLinkType
}

registerEnumType(MetaLinkType, {
  name: 'LicensesMetaLinkType',
})
