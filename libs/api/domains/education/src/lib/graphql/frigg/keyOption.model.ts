import { Field, ObjectType } from '@nestjs/graphql'

import { FriggOptionModel } from './option.model'

@ObjectType('EducationFriggKeyOptionModel')
export class KeyOptionModel {
  @Field()
  type!: string

  @Field(() => [FriggOptionModel])
  options!: FriggOptionModel[]
}
