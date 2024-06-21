import { Field, ObjectType } from '@nestjs/graphql'

import { FriggValueModel } from './value.model'

@ObjectType('EducationFriggOptionModel')
export class FriggOptionModel {
  @Field()
  id!: string

  @Field()
  key!: string

  @Field(() => [FriggValueModel])
  value!: FriggValueModel[]
}
