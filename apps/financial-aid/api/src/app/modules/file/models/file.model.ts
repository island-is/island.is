import { Field, ID, ObjectType } from '@nestjs/graphql'

import { ApplicationFile, FileType } from '@island.is/financial-aid/shared'

@ObjectType()
export class ApplicationFileModel implements ApplicationFile {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly created!: string

  @Field()
  readonly applicationId!: string

  @Field()
  readonly name!: string

  @Field()
  readonly key!: string

  @Field()
  readonly size!: number

  @Field(() => String)
  readonly type!: FileType
}
