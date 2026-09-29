import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class Teacher {
  @Field(() => ID)
  nationalId!: string

  @Field()
  name!: string
}

@ObjectType()
export class TeacherV4 {
  @Field(() => ID)
  nationalId!: string

  @Field()
  name!: string

  @Field(() => Number, { nullable: true })
  driverLicenseId?: number | null
}
