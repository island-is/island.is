import { Field, ID, ObjectType } from '@nestjs/graphql'

import { DirectorateOfEqualityApiKeyType } from './enums'

@ObjectType('DirectorateOfEqualityApiKey')
export class ApiKey {
  @Field(() => ID)
  id!: string

  @Field(() => String, {
    description: 'Public half of the key, not a secret',
  })
  keyId!: string

  @Field(() => DirectorateOfEqualityApiKeyType)
  type!: DirectorateOfEqualityApiKeyType

  @Field(() => String, { nullable: true })
  label?: string

  @Field(() => Date)
  createdAt!: Date

  @Field(() => String, {
    nullable: true,
    description: 'Name of the person who created the key on island.is',
  })
  createdByName?: string

  @Field(() => Boolean, {
    description: 'True when Jafnréttisstofa created the key',
  })
  createdByDirectorate!: boolean

  @Field(() => Date, { nullable: true, description: 'Null means no expiry' })
  expiresAt?: Date

  @Field(() => Date, { nullable: true })
  lastUsedAt?: Date

  @Field(() => Date, { nullable: true })
  revokedAt?: Date
}
