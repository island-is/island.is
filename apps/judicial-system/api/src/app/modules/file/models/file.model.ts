import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

import {
  CaseFileCategory,
  CaseFileState,
} from '@island.is/judicial-system/types'

registerEnumType(CaseFileCategory, { name: 'CaseFileCategory' })
registerEnumType(CaseFileState, { name: 'CaseFileState' })

@ObjectType()
export class CaseFile {
  @Field(() => ID)
  readonly id!: string
  @Field({ nullable: true })
  readonly created?: string

  @Field({ nullable: true })
  readonly modified?: string

  @Field({ nullable: true })
  readonly caseId?: string

  @Field({ nullable: true })
  readonly name?: string

  @Field({ nullable: true })
  readonly type?: string

  @Field(() => CaseFileCategory, { nullable: true })
  readonly category?: CaseFileCategory

  @Field(() => CaseFileState, { nullable: true })
  readonly state?: CaseFileState

  @Field({ nullable: true })
  readonly key?: string

  @Field(() => Int, { nullable: true })
  readonly size?: number

  @Field({ nullable: true })
  readonly policeCaseNumber?: string

  @Field({ nullable: true })
  readonly userGeneratedFilename?: string

  @Field(() => Int, { nullable: true })
  readonly chapter?: number

  @Field(() => Int, { nullable: true })
  readonly orderWithinChapter?: number

  @Field({ nullable: true })
  readonly displayDate?: string

  @Field({ nullable: true })
  readonly policeFileId?: string
}
