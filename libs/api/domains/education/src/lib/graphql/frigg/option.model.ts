import { Field, ObjectType } from '@nestjs/graphql'

import { FriggValueModel } from './value.model'

@ObjectType()
export class FriggOptionModel {
  @Field(() => String)
  id!: string

  @Field(() => String)
  key!: Array<FriggOptionModel>

  @Field(() => [FriggValueModel])
  value!: FriggValueModel[]
}
