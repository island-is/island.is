import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('UniversityCareersStudentFile')
export class StudentFile {
  @Field()
  displayName!: string

  @Field()
  fileName!: string

  @Field({ nullable: true })
  downloadServiceURL?: string

  // Internal only — not exposed in GraphQL schema
  url?: string
}
