import { Field, ID, ObjectType } from '@nestjs/graphql'

import type {
  CaseFile as TCaseFile,
  CaseFileCategory,
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

  @Field()
  readonly type!: string

  @Field(() => String, { nullable: true })
  readonly category?: CaseFileCategory

  @Field(() => String)
  readonly state!: CaseFileState

  @Field({ nullable: true })
  readonly key?: string

  @Field()
  readonly size!: number

  @Field({ nullable: true })
  readonly policeCaseNumber?: string

  @Field({ nullable: true })
  readonly userGeneratedFilename?: string

  @Field({ nullable: true })
  readonly chapter?: number

  @Field({ nullable: true })
  readonly orderWithinChapter?: number

  @Field({ nullable: true })
  readonly displayDate?: string

  @Field({ nullable: true })
  readonly policeFileId?: string
}
