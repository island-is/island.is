import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class EducationSignedLicense {
  @Field(() => ID)
  url!: string
}
