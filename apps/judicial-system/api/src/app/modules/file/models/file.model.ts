import { Field, ID, ObjectType } from '@nestjs/graphql'

import { File as TFile } from '@island.is/judicial-system/types'

@ObjectType()
export class File implements TFile {
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
  readonly key!: string

  @Field()
  readonly size!: number
}
