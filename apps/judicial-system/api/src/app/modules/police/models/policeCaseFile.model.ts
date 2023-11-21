import { Field, ID, ObjectType } from '@nestjs/graphql'

import type { PoliceCaseFile as TPoliceCaseFile } from '@island.is/judicial-system/types'

@ObjectType()
export class PoliceCaseFile implements TPoliceCaseFile {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly name!: string

  @Field()
  readonly policeCaseNumber!: string

  @Field({ nullable: true })
  readonly chapter?: number

  @Field({ nullable: true })
  readonly displayDate?: string
}
