import { Field, ObjectType } from '@nestjs/graphql'
import { InstututionModel } from './studentInfo.model'

@ObjectType()
export class StudentDetailModel {
  @Field(() => String)
  name!: string

  @Field(() => String, { nullable: true })
  kennitala?: string

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
export class StudentFiles {
  @Field(() => String)
  type!: string

  @Field(() => String)
  displayName!: string

  @Field(() => String)
  fileName!: string
}

@ObjectType()
export class StudentDescription {
  @Field(() => String)
  description!: string

  @Field(() => String)
  footer!: string
}

@ObjectType()
export class StudentInfoDetailModel {
  @Field(() => StudentDetailModel)
  transcript!: StudentDetailModel

  @Field(() => [StudentFiles])
  files!: [StudentFiles]

  @Field(() => StudentDescription)
  body!: StudentDescription

  @Field(() => String, { nullable: true })
  downloadServiceURL?: string
}
