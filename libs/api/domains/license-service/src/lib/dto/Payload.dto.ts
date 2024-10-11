import { Field, ObjectType } from '@nestjs/graphql'
import { GraphQLJSON } from 'graphql-type-json'
import { GenericLicenseDataField } from './GenericLicenseDataField.dto'
import { GenericUserLicenseMetadata } from './GenericUserLicenseMetadata.dto'

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
  rawData?: string

  @Field(() => GenericUserLicenseMetadata)
  metadata?: GenericUserLicenseMetadata
}
