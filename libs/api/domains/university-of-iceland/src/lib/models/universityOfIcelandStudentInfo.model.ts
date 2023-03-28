import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class InstitutionModel {
  @Field(() => String)
  id!: string

  @Field(() => String)
  displayName!: string
}
@ObjectType()
export class StudentDescription {
  @Field(() => String)
  description!: string

  @Field(() => String)
  footer!: string
}

@ObjectType()
export class StudentModel {
  @Field(() => String)
  name!: string

  @Field(() => String)
  nationalId!: string

  @Field(() => String)
  graduationDate!: string

  @Field(() => Number)
  trackNumber!: number

  @Field(() => InstitutionModel)
  institution!: InstitutionModel

  @Field(() => String)
  school!: string

  @Field(() => String)
  faculty!: string

  @Field(() => String)
  studyProgram!: string

  @Field(() => String)
  degree!: string
}
@ObjectType()
export class StudentTrackModel {
  @Field(() => StudentModel)
  transcript!: StudentModel

  @Field(() => [StudentFiles])
  files!: StudentFiles[]

  @Field(() => StudentDescription)
  body!: StudentDescription

  @Field(() => String, { nullable: true })
  downloadServiceURL?: string
}

@ObjectType()
export class UniversityOfIcelandStudentInfoModel {
  @Field(() => [StudentModel], { nullable: true })
  transcripts?: StudentModel[]
  @Field(() => StudentTrackModel, { nullable: true })
  track?: StudentTrackModel
}
@ObjectType()
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
