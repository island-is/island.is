import { ObjectType, Field } from '@nestjs/graphql'
import { Student } from './student.model'
import { StudentDescription } from './studentDescription.model'
import { StudentFile } from './studentFile.model'

@ObjectType('UniversityCareersStudentTrack')
export class StudentTrack {
  @Field(() => Student)
  transcript!: Student

  @Field(() => [StudentFile])
  files!: StudentFile[]

  @Field(() => StudentDescription)
  body!: StudentDescription

  @Field(() => String, { nullable: true })
  downloadServiceURL?: string
}
