import { Field, ObjectType } from '@nestjs/graphql'
import { IsObject } from 'class-validator'
import graphqlTypeJson from 'graphql-type-json'
import { GenericLicenseDataField } from './GenericLicenseDataField.dto'
import { GenericUserLicenseMetadata } from './GenericUserLicenseMetadata.dto'

@ObjectType()
export class Payload {
  @Field(() => [GenericLicenseDataField], {
    description: 'Data parsed into a standard format',
  })
  data!: GenericLicenseDataField[]

  @Field(() => graphqlTypeJson, {
    nullable: true,
    description: 'Raw JSON data',
  })
  @IsObject()
  // eslint-disable-next-line @typescript-eslint/ban-types
  rawData?: object

  @Field(() => GenericUserLicenseMetadata)
  metadata?: GenericUserLicenseMetadata
}
