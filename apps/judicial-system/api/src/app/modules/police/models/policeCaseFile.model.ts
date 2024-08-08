import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

import { CaseFileCategory } from '@island.is/judicial-system/types'

@ObjectType()
export class PoliceCaseFile {
  @Field(() => ID)
  readonly id!: string

  @Field(() => String)
  readonly name!: string

  @Field(() => String)
  readonly policeCaseNumber!: string

  @Field(() => Int, { nullable: true })
  readonly chapter?: number

  @Field(() => String, { nullable: true })
  readonly displayDate?: string

  @Field(() => CaseFileCategory, { nullable: true })
  readonly category?: CaseFileCategory
}
