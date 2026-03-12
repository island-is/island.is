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

  @Field(() => String, { nullable: true })
  readonly created?: string

  @Field(() => String, { nullable: true })
  readonly modified?: string

  @Field(() => ID, { nullable: true })
  readonly caseId?: string

  @Field(() => ID, { nullable: true })
  readonly defendantId?: string

  @Field(() => String, { nullable: true })
  readonly name?: string

  @Field(() => String, { nullable: true })
  readonly type?: string

  @Field(() => CaseFileCategory, { nullable: true })
  readonly category?: CaseFileCategory

  @Field(() => CaseFileState, { nullable: true })
  readonly state?: CaseFileState

  @Field(() => String, { nullable: true })
  readonly key?: string

  @Field(() => Int, { nullable: true })
  readonly size?: number

  @Field(() => String, { nullable: true })
  readonly policeCaseNumber?: string

  @Field(() => String, { nullable: true })
  readonly userGeneratedFilename?: string

  @Field(() => Int, { nullable: true })
  readonly chapter?: number

  @Field(() => Int, { nullable: true })
  readonly orderWithinChapter?: number

  @Field(() => String, { nullable: true })
  readonly displayDate?: string

  @Field(() => String, { nullable: true })
  readonly policeFileId?: string

  @Field(() => String, { nullable: true })
  readonly submittedBy?: string

  // custom case file submission for example when documents are submitted in person to court
  @Field(() => String, { nullable: true })
  readonly submissionDate?: string

  // when users submit files on behalf of case representatives
  @Field(() => String, { nullable: true })
  readonly fileRepresentative?: string

  @Field(() => Boolean, { nullable: true })
  readonly isKeyAccessible?: boolean
}
