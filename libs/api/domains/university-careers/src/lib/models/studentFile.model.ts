import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('UniversityCareersStudentFile')
export class StudentFile {
  @Field(() => String)
  type!: string

  @Field(() => String)
  locale!: string

  @Field(() => String)
  displayName!: string

  @Field(() => String)
  fileName!: string
}
