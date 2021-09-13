import { Field, ID, ObjectType } from '@nestjs/graphql'

import type {
  CaseFile as TCaseFile,
  CaseFileState,
} from '@island.is/judicial-system/types'

@ObjectType()
export class CaseFile implements TCaseFile {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly created!: string

  @Field()
  readonly modified!: string

  @Field()
  readonly caseId!: string

  @Field()
  readonly name!: string

  @Field(() => String)
  readonly state!: CaseFileState

  @Field()
  readonly key!: string

  @Field()
  readonly size!: number

  @Field({ nullable: true })
  readonly courtKey?: string
}
