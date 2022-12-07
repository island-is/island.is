import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AnonymityStatus {
  @Field(() => Boolean, { nullable: true })
  isChecked?: boolean
}
