import { ObjectType, Field } from '@nestjs/graphql'
import { Institution } from './institution.model'

@ObjectType('UniversityCareersStudentTrackTranscript')
export class StudentTrackTranscript {
  @Field(() => String)
  name!: string

  @Field(() => String, { nullable: true })
  nationalId?: string

  @Field(() => String)
  graduationDate!: string

  @Field(() => Number)
  trackNumber!: number

  @Field(() => Institution)
  institution!: Institution

  @Field(() => String)
  school!: string

  @Field(() => String)
  faculty!: string

  @Field(() => String)
  studyProgram!: string

  @Field(() => String)
  degree!: string
}
