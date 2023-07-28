import { Field, ID, ObjectType } from '@nestjs/graphql'
import { TranslatedValue } from '../../models/translated-value.model'

@ObjectType('AuthAdminClientAllowedScope')
export class ClientAllowedScope {
  @Field(() => ID)
  name!: string

  @Field(() => [TranslatedValue], { nullable: false })
  displayName!: TranslatedValue[]

  @Field(() => [TranslatedValue], { nullable: true })
  description?: TranslatedValue[]

  @Field(() => String, { nullable: true })
  domainName?: string
}
