import { Field, ID,ObjectType } from '@nestjs/graphql'

@ObjectType()
export class EducationSignedLicense {
  @Field(() => ID)
  url!: string
}
