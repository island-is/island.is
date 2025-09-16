import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DeleteEmailOrPhoneSettings {
  @Field(() => String)
  nationalId!: string

  @Field(() => Boolean)
  valid!: boolean
}
