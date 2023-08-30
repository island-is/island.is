import { Field, ObjectType } from '@nestjs/graphql'
@ObjectType()
export class DrivingSchoolType {
  @Field()
  schoolTypeId!: number

  @Field()
  schoolTypeName!: string

  @Field()
  schoolTypeCode!: string

  @Field()
  licenseCategory!: string
}
