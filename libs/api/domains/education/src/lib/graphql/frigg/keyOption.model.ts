import { Field, ObjectType } from '@nestjs/graphql'

import { FriggOptionModel } from './option.model'

@ObjectType()
export class KeyOptionModel {
  @Field(() => String)
  type!: string

  @Field(() => [FriggOptionModel])
  options!: FriggOptionModel[]
}
