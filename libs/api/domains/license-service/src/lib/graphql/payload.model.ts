import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'
import { GenericLicenseDataFieldType } from '../licenceService.type'

registerEnumType(GenericLicenseDataFieldType, {
  name: 'GenericLicenseDataFieldType',
  description: 'Possible types of data fields',
})

@ObjectType()
// TODO(osk) document this since the difference between name, label and value is very vague
export class DataField {
  @Field(() => GenericLicenseDataFieldType, {
    description: 'Type of data field',
  })
  type!: GenericLicenseDataFieldType

  @Field({ nullable: true, description: 'Name of data field' })
  name?: string

  @Field({ nullable: true, description: 'Label of data field' })
  label?: string

  @Field({ nullable: true, description: 'Value of data field' })
  value?: string

  @Field(() => [DataField], {
    nullable: true,
    description: 'Name of data field',
  })
  fields?: DataField[]
}

@ObjectType()
export class Payload {
  @Field(() => [DataField], {
    description: 'Data parsed into a standard format',
  })
  data!: DataField[]

  // TODO(osk) how do we represent json?
  @Field({ nullable: true, description: 'Raw JSON data' })
  rawData?: string
}
