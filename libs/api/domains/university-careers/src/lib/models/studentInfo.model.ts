import { Field, ObjectType } from '@nestjs/graphql'
import { Student } from './student.model'
import { StudentTrack } from './studentTrack.model'

@ObjectType('UniversityOfIcelandStudentInfo')
export class StudentInfo {
  @Field(() => [Student], { nullable: true })
  transcripts?: Student[]
  @Field(() => StudentTrack, { nullable: true })
  track?: StudentTrack
}
