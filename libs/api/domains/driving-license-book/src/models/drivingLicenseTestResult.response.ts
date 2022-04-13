import { Field, ID, ObjectType, PickType } from '@nestjs/graphql'

@ObjectType()
export class DrivingLicenceTestResult {
  @Field(() => ID)
  id!: string

  @Field()
  examDate!: string

  @Field()
  score!: number

  @Field()
  scorePart1!: number

  @Field()
  scorePart2!: number

  @Field()
  hasPassed!: boolean

  @Field()
  testCenterNationalId!: string

  @Field()
  testCenterName!: string

  @Field()
  testExaminerNationalId!: string

  @Field()
  testExaminerName!: string

  @Field()
  testTypeId!: number

  @Field()
  testTypeName!: string

  @Field()
  testTypeCode!: string

  @Field()
  comments!: string
}

@ObjectType()
export class DrivingLicenceTestResultId extends PickType(
  DrivingLicenceTestResult,
  ['id'],
) {}
