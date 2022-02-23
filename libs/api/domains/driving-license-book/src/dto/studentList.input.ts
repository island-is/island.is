import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class StudentListInput {
  @Field({ nullable: true })
  key?: string

  @Field({ nullable: true })
  licenseCategory?: string

  @Field({ nullable: true })
  cursor?: string

  @Field({ nullable: true })
  limit?: number
}
