export interface SchoolTestResultType {}

import { Field, ObjectType } from '@nestjs/graphql'
@ObjectType()
export class SchoolTestResultType {
  @Field()
  schoolTypeId!: number

  @Field()
  schoolTypeName!: string

  @Field()
  schoolTypeCode!: string

  @Field()
  licenseCategory!: string
}
