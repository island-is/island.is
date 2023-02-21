import { Field, ID, ObjectType } from '@nestjs/graphql'

import { TranslatedValue } from './translated-value.model'

@ObjectType('AuthAdminApplication')
export class Application {
  @Field(() => ID)
  name!: string

  @Field(() => [TranslatedValue])
  displayName!: TranslatedValue[]
}
