import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DrivingLicenceTestResult {
  @Field(() => ID, { nullable: true })
  id?: string

  @Field({ nullable: true })
  examDate?: string

  @Field({ nullable: true })
  score?: number

  @Field({ nullable: true })
  scorePart1?: number

  @Field({ nullable: true })
  scorePart2?: number

  @Field({ nullable: true })
  hasPassed?: boolean

  @Field({ nullable: true })
  testCenterSsn?: string

  @Field({ nullable: true })
  testCenterName?: string

  @Field({ nullable: true })
  testExaminerSsn?: string

  @Field({ nullable: true })
  testExaminerName?: string

  @Field({ nullable: true })
  testTypeId?: number

  @Field({ nullable: true })
  testTypeName?: string

  @Field({ nullable: true })
  testTypeCode?: string

  @Field({ nullable: true })
  comments?: string
}
