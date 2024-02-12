import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class StaffModel {
  @Field()
  readonly name!: string

  @Field()
  readonly nationalId!: string
}
