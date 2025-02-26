import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('EducationFriggValueModel')
export class FriggValueModel {
  @Field()
  content!: string

  @Field()
  language!: string
}
