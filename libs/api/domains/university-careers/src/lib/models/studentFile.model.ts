import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('UniversityCareersStudentFile')
export class StudentFile {
  @Field()
  type!: string

  @Field()
  locale!: string

  @Field()
  displayName!: string

  @Field()
  fileName!: string
}
