import { Field, ObjectType } from '@nestjs/graphql'
import { GenericLicenseDataField } from './GenericLicenseDataField.dto'
import { GenericUserLicenseMetadata } from './GenericUserLicenseMetadata.dto'
import GraphQLJSON from 'graphql-type-json'

@ObjectType()
export class Payload {
  @Field(() => [GenericLicenseDataField], {
    description: 'Data parsed into a standard format',
  })
  data!: GenericLicenseDataField[]

  @Field(() => GraphQLJSON, {
    nullable: true,
    description: 'Raw JSON data',
  })
  rawData?: object

  @Field(() => GenericUserLicenseMetadata)
  metadata?: GenericUserLicenseMetadata
}
