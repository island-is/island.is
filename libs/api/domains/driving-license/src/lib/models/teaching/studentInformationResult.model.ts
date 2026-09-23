import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class StudentInformation {
  @Field()
  name!: string
}

@ObjectType()
export class StudentInformationResult {
  @Field(() => StudentInformation, { nullable: true })
  student?: StudentInformation
}
