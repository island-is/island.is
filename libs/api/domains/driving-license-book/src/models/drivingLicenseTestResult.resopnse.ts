import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DrivingLicenceTestResult {
    @Field({ nullable: true })
  id?: string | null
  
  @Field({ nullable: true })
  examDate?: string | null
  
  @Field({ nullable: true })
  score?: number
  
  @Field({ nullable: true })
  scorePart1?: number | null
  
  @Field({ nullable: true })
  scorePart2?: number | null
  
  @Field({ nullable: true })
  hasPassed?: boolean
  
  @Field({ nullable: true })
  testCenterSsn?: string | null
  
  @Field({ nullable: true })
  testCenterName?: string | null
  
  @Field({ nullable: true })
  testExaminerSsn?: string | null
  
  @Field({ nullable: true })
  testExaminerName?: string | null
  
  @Field({ nullable: true })
  testTypeId?: number
  
  @Field({ nullable: true })
  testTypeName?: string | null
  
  @Field({ nullable: true })
  testTypeCode?: string | null
  
  @Field({ nullable: true })
  comments?: string | null
}
