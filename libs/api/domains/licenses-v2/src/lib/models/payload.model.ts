import { Field, ObjectType } from '@nestjs/graphql'
import { DataField } from './dataField.model'
import graphqlTypeJson from 'graphql-type-json'
import { IsObject } from 'class-validator'

@ObjectType('LicensesPayload')
export class Payload {
  @Field(() => [DataField], {
    description: 'Data parsed into a standard format',
  })
  dataFields!: Array<DataField>

  @Field(() => graphqlTypeJson, {
    nullable: true,
    description: 'Raw JSON data',
  })
  @IsObject()
  rawData?: object
}
