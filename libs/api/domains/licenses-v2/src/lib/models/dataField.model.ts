import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { DataFieldType } from '../licenses.type'
import { MetaLink } from './metaLink.model'

registerEnumType(DataFieldType, {
  name: 'LicensesDataFieldType',
  description: 'Possible types of data fields',
})

@ObjectType('LicensesDataField')
export class DataField {
  @Field(() => DataFieldType)
  type!: DataFieldType

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  label?: string

  @Field({ nullable: true })
  value?: string

  @Field(() => MetaLink, {
    nullable: true,
  })
  link?: MetaLink

  @Field({
    nullable: true,
    description: 'Hide from service portal',
    defaultValue: false,
  })
  hideFromServicePortal?: boolean

  @Field(() => [DataField], {
    nullable: true,
  })
  fields?: Array<DataField>
}
