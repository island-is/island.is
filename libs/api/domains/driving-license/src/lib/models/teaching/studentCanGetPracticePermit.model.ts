import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class StudentCanGetPracticePermit {
  @Field({ nullable: true })
  student?: string

  @Field({ nullable: true })
  instructor?: string

  @Field({ nullable: true })
  errorCode?: string

  @Field({ nullable: true })
  isOk?: boolean
}
