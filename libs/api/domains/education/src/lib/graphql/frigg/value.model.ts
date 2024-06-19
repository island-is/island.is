import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FriggValueModel {
  @Field(() => String)
  content!: string

  @Field(() => String)
  language!: string
}
