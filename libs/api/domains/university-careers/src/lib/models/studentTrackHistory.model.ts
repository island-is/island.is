import { Field, ObjectType } from '@nestjs/graphql'
import { StudentTrackTranscript } from './studentTrackTranscript.model'

@ObjectType('UniversityCareersStudentTrackHistory')
export class StudentTrackHistory {
  @Field(() => [StudentTrackTranscript], { nullable: true })
  universityOfIceland?: Array<StudentTrackTranscript | null>

  @Field(() => [StudentTrackTranscript], { nullable: true })
  universityOfAkureyri?: Array<StudentTrackTranscript | null>

  @Field(() => [StudentTrackTranscript], { nullable: true })
  bifrostUniversity?: Array<StudentTrackTranscript | null>

  @Field(() => [StudentTrackTranscript], { nullable: true })
  holarUniversity?: Array<StudentTrackTranscript | null>

  @Field(() => [StudentTrackTranscript], { nullable: true })
  agriculturalUniversityOfIceland?: Array<StudentTrackTranscript | null>
}
