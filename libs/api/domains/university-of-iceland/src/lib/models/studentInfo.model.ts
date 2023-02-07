import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class InstututionModel {
  @Field(() => String)
  id!: string

  @Field(() => String)
  displayName!: string
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

  @Field(() => InstututionModel)
  instutution!: InstututionModel

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
export class StudentInfoModel {
  @Field(() => [StudentModel])
  transcripts!: [StudentModel]
}
