import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('UniversityOfIcelandInstitution')
export class Institution {
  @Field(() => String)
  id!: string

  @Field(() => String)
  displayName!: string
}
@ObjectType('UniversityOfIcelandStudentDescription')
export class StudentDescription {
  @Field(() => String)
  description!: string

  @Field(() => String)
  footer!: string

  @Field(() => String, { nullable: true })
  unconfirmedData?: string
}

@ObjectType('UniversityOfIcelandStudent')
export class Student {
  @Field(() => String)
  name!: string

  @Field(() => String, { nullable: true })
  nationalId?: string

  @Field(() => String)
  graduationDate!: string

  @Field(() => Number)
  trackNumber!: number

  @Field(() => Institution, { nullable: true })
  institution?: Institution

  @Field(() => String)
  school!: string

  @Field(() => String)
  faculty!: string

  @Field(() => String)
  studyProgram!: string

  @Field(() => String)
  degree!: string
}
@ObjectType('UniversityOfIcelandStudentTrack')
export class StudentTrackModel {
  @Field(() => Student)
  transcript!: Student

  @Field(() => [StudentFiles])
  files!: StudentFiles[]

  @Field(() => StudentDescription)
  body!: StudentDescription

  @Field(() => String, { nullable: true })
  downloadServiceURL?: string
}

@ObjectType('UniversityOfIcelandStudentInfo')
export class StudentInfo {
  @Field(() => [Student], { nullable: true })
  transcripts?: Student[]
  @Field(() => StudentTrackModel, { nullable: true })
  track?: StudentTrackModel
}
@ObjectType('UniversityOfIcelandStudentFiles')
export class StudentFiles {
  @Field(() => String)
  type!: string

  @Field(() => String)
  locale!: string

  @Field(() => String)
  displayName!: string

  @Field(() => String)
  fileName!: string
}
