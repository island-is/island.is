import { Field, ObjectType } from '@nestjs/graphql'

import { FileType } from '@island.is/financial-aid/shared/lib'

@ObjectType()
export class ApplicationFileModel {
  @Field()
  readonly name!: string

  @Field()
  readonly key!: string

  @Field(() => String)
  readonly type!: FileType
}
